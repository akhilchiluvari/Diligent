import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_PATH = path.join(__dirname, '../data/users.json');

class AuthService {
  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    try {
      if (fs.existsSync(USERS_PATH)) {
        const raw = fs.readFileSync(USERS_PATH, 'utf-8');
        this.users = JSON.parse(raw);
      } else {
        // Default seed user
        this.users = [
          {
            id: 'usr_001',
            email: 'akhil@diligent.ai',
            password: 'password123',
            name: 'Akhil Chiluvari',
            businessName: 'Sri Balaji Smart Retail & Tech Mart',
            category: 'Hybrid Supermart & Consumer Electronics',
            location: 'Madhapur, HITEC City, Hyderabad',
            revenueTier: '₹15L - ₹35L / month',
            createdAt: '2026-09-29T20:00:00Z'
          }
        ];
        this.saveUsers();
      }
    } catch (e) {
      this.users = [];
    }
  }

  saveUsers() {
    try {
      fs.writeFileSync(USERS_PATH, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving users:', e);
    }
  }

  register({ email, password, name, businessName, category, location, revenueTier }) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const existing = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      email: email.toLowerCase().trim(),
      password, // In a full production app, use bcrypt hashing
      name: name || 'Business Founder',
      businessName: businessName || 'My Retail Enterprise',
      category: category || 'Retail & Supermarket',
      location: location || 'Hyderabad, Telangana',
      revenueTier: revenueTier || '₹10L - ₹25L / month',
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();

    // Return safe user object (without password)
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }

  login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password.');
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
