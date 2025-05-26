import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import simpleGit, { SimpleGit } from "simple-git";

/**
 * Attempts to detect the current user's email address by:
 * 1. Checking global Git config
 * 2. Checking local Git config
 * 3. Inspecting environment variables
 * 4. Parsing ~/.gitconfig manually
 *
 * @returns a detected email, or undefined if none could be found
 */
export async function detectUserEmail(): Promise<string | undefined> {
  // 1. Try global Git config
  try {
    const git: SimpleGit = simpleGit();
    const raw = await git.raw(['config', '--global', 'user.email']);
    const email = raw.trim();
    if (email) {
      return email;
    }
  } catch {
    // ignore
  }

  // 2. Try local Git config (in case you're in a repo with per-repo override)
  try {
    const git: SimpleGit = simpleGit(process.cwd());
    const raw = await git.raw(['config', 'user.email']);
    const email = raw.trim();
    if (email) {
      return email;
    }
  } catch {
    // ignore
  }

  // 3. Environment variables commonly used for email
  for (const varName of [
    'GIT_AUTHOR_EMAIL',
    'GIT_COMMITTER_EMAIL',
    'EMAIL',
    'USER_EMAIL',
  ]) {
    const val = process.env[varName];
    if (val) {
      return val;
    }
  }

  // 4. Parse ~/.gitconfig directly
  try {
    const home = homedir();
    const configPath = path.join(home, '.gitconfig');
    const content = readFileSync(configPath, 'utf8');
    // look for:
    // [user]
    //     email = foo@bar.com
    const match = content.match(/\[user\][^\[]*email\s*=\s*(.+)/i);
    if (match) {
      return match[1].trim();
    }
  } catch {
    // ignore
  }

  // nothing found
  return undefined;
}
