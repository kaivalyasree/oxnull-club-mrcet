import readline from 'readline';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

async function prompt(question: string, hidden: boolean = false): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    if (!hidden) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    } else {
      process.stdout.write(question);
      let input = '';
      const onData = (char: Buffer) => {
        const str = char.toString('utf-8');
        switch (str) {
          case '\n':
          case '\r':
          case '\u0004':
            process.stdin.removeListener('data', onData);
            process.stdout.write('\n');
            rl.close();
            resolve(input.trim());
            break;
          case '\u0003': // Ctrl+C
            process.exit(1);
            break;
          case '\b':
          case '\x7f': // Backspace
            if (input.length > 0) {
              input = input.slice(0, -1);
              process.stdout.write('\b \b');
            }
            break;
          default:
            input += str;
            process.stdout.write('*');
            break;
        }
      };

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', onData);
      } else {
        // Fallback for non-TTY environments
        rl.question('', (answer) => {
          rl.close();
          resolve(answer.trim());
        });
      }
    }
  });
}

async function main() {
  console.log('\n================================================================');
  console.log('  0XNULL SECURITY CLUB — SECURE ADMINISTRATOR SETUP');
  console.log('================================================================\n');
  console.log('This utility hashes your chosen administrator password with bcrypt');
  console.log('and configures your local environment without printing or leaking');
  console.log('the plaintext password.\n');

  // Support command line arguments or interactive prompts
  let username = process.argv[2];
  let password = process.argv[3];

  if (!username) {
    username = await prompt('Enter desired administrator username [oxnull-admin]: ');
    if (!username) username = 'oxnull-admin';
  }

  if (!password) {
    password = await prompt('Enter desired administrator password: ', true);
    if (!password) {
      console.error('\nError: Password cannot be empty.');
      process.exit(1);
    }

    const confirmPassword = await prompt('Confirm administrator password: ', true);
    if (password !== confirmPassword) {
      console.error('\nError: Passwords do not match.');
      process.exit(1);
    }
  }

  if (password.length < 8) {
    console.warn('\nWarning: It is recommended to use at least 8 characters for admin passwords.');
  }

  console.log('\nGenerating bcrypt salt and hash (cost: 10)...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Generate strong random session secret if none exists
  const sessionSecret = crypto.randomBytes(32).toString('hex');

  // Update or create .env.local
  const envLocalPath = path.join(process.cwd(), '.env.local');
  let envLines: string[] = [];

  if (fs.existsSync(envLocalPath)) {
    const existingContent = fs.readFileSync(envLocalPath, 'utf-8');
    envLines = existingContent.split(/\r?\n/).filter((line) => {
      const trimmed = line.trim();
      return (
        !trimmed.startsWith('ADMIN_USERNAME=') &&
        !trimmed.startsWith('ADMIN_PASSWORD_HASH=') &&
        !trimmed.startsWith('ADMIN_SESSION_SECRET=')
      );
    });
  }

  envLines.push(`# 0XNULL Administrator Authentication (Server-Only)`);
  envLines.push(`ADMIN_USERNAME="${username}"`);
  envLines.push(`ADMIN_PASSWORD_HASH="${passwordHash}"`);
  envLines.push(`ADMIN_SESSION_SECRET="${sessionSecret}"`);

  fs.writeFileSync(envLocalPath, envLines.join('\n') + '\n', 'utf-8');

  console.log('\n[SUCCESS] Local configuration saved to .env.local (gitignored).');
  console.log('\n----------------------------------------------------------------');
  console.log('  ENVIRONMENT VARIABLES FOR VERCEL PRODUCTION DEPLOYMENT');
  console.log('----------------------------------------------------------------');
  console.log('Add the following 3 variables in Vercel > Project > Settings > Environment Variables:');
  console.log('\nKey:   ADMIN_USERNAME');
  console.log(`Value: ${username}`);
  console.log('\nKey:   ADMIN_PASSWORD_HASH');
  console.log(`Value: ${passwordHash}`);
  console.log('\nKey:   ADMIN_SESSION_SECRET');
  console.log(`Value: ${sessionSecret}`);
  console.log('\n----------------------------------------------------------------');
  console.log('Your plain password was NOT logged, printed, or saved in any tracked file.');
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
