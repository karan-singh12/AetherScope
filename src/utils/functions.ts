import nodemailer, { Transporter } from "nodemailer";
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';
import { getDB } from '../config/db.config';
import he from "he";
import 'multer';

// Utility function to generate slugs from titles
function slugGenrator(title: string): string {
  let slug = title;

  // Remove special characters
  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    ""
  );

  // Replace spaces with dash symbols
  slug = slug.replace(/ /gi, "-");

  // Remove consecutive dash symbols
  slug = slug.replace(/\-\-\-\-\-/gi, "-");
  slug = slug.replace(/\-\-\-\-/gi, "-");
  slug = slug.replace(/\-\-\-/gi, "-");
  slug = slug.replace(/\-\-/gi, "-");

  // Remove unwanted dash symbols at the beginning and end of the slug
  slug = "@" + slug + "@";
  slug = slug.replace(/\@\-|\-\@|\@/gi, "");

  return slug;
}

// Email sending function
interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<number> => {
  return new Promise((resolve, reject) => {
    const mailTransporter: Transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const message = {
      from: `AetherScope <${process.env.EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: he.decode(options.message),
    };

    mailTransporter
      .sendMail(message)
      .then(() => {
        console.log("Email sent");
        resolve(1);
      })
      .catch((error: any) => {
        console.error("Error sending email", error);
        resolve(0);
      });
  });
};

function generatePassword(length = 12) {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialCharacters = '!@#$%&';

  // Ensure the password contains at least one uppercase letter, one number, and one special character
  let password = [
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
  ];

  // Fill the rest of the password length with random choices from all character sets
  const allCharacters = uppercaseLetters + lowercaseLetters + numbers + specialCharacters;
  for (let i = password.length; i < length; i++) {
    password.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
  }

  // Shuffle the password array
  password = password.sort(() => Math.random() - 0.5);

  // Return the password as a string
  return password.join('');
}


const deleteUploadedFile = async (filePath: string | string[] | undefined | null): Promise<boolean> => {
  if (!filePath) return true; // No file to delete

  const paths = Array.isArray(filePath) ? filePath : [filePath];
  let allDeleted = true;

  for (const file of paths) {
    if (!file) continue;

    try {
      // Handle both relative and absolute paths
      let fullPath: string;
      if (path.isAbsolute(file)) {
        fullPath = file;
      } else {
        // If relative, assume it's relative to app root
        fullPath = path.join(appRoot.path, file);
      }

      // Check if file exists
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`✅ Deleted uploaded file: ${fullPath}`);
      } else {
        console.warn(`⚠️  File not found for deletion: ${fullPath}`);
      }
    } catch (error: any) {
      console.error(`❌ Error deleting file ${file}:`, error.message);
      allDeleted = false;
    }
  }

  return allDeleted;
};


const deleteMulterFile = async (file: Express.Multer.File | Express.Multer.File[] | undefined | null): Promise<boolean> => {
  if (!file) return true;

  const files = Array.isArray(file) ? file : [file];
  const paths = files.map(f => f.path).filter(Boolean);

  return await deleteUploadedFile(paths);
};

export { slugGenrator, sendEmail, generatePassword, deleteUploadedFile, deleteMulterFile };
