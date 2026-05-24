import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { User } from '@/lib/types';

// GET all users
export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.users || []);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve users' }, { status: 500 });
  }
}

// POST create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role, bio, avatar, password } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing required user parameters' }, { status: 400 });
    }

    const db = readDb();
    
    // Check if email already exists
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: role as any,
      bio: bio || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      postsCount: 0,
      password: password || 'password123'
    };

    db.users.push(newUser);
    writeDb(db);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}

// PUT update user
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, role, bio, avatar, password } = body;

    if (!id || !name || !email || !role) {
      return NextResponse.json({ error: 'Missing required parameters for update' }, { status: 400 });
    }

    const db = readDb();
    const idx = db.users.findIndex(u => u.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if new email conflicts with another user
    if (db.users.some(u => u.id !== id && u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'Email conflicts with another user' }, { status: 400 });
    }

    const updatedUser: User = {
      ...db.users[idx],
      name,
      email,
      role: role as any,
      bio: bio || '',
      avatar: avatar || db.users[idx].avatar,
      password: password || db.users[idx].password
    };

    db.users[idx] = updatedUser;
    
    // Also sync author details inside existing posts if role/name/avatar changes
    db.posts = db.posts.map(post => {
      // If the post matches this user's name or some tracking (e.g. check by matching author name/avatar)
      // Since posts store the author object inside, let's sync it:
      if (post.author && post.author.name === db.users[idx].name) {
        return {
          ...post,
          author: {
            name: updatedUser.name,
            avatar: updatedUser.avatar,
            role: updatedUser.role.charAt(0).toUpperCase() + updatedUser.role.slice(1)
          }
        };
      }
      return post;
    });

    writeDb(db);

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = readDb();
    const idx = db.users.findIndex(u => u.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure we don't delete the last administrator
    if (db.users[idx].role === 'administrator' && db.users.filter(u => u.role === 'administrator').length <= 1) {
      return NextResponse.json({ error: 'Cannot delete the only administrator account' }, { status: 400 });
    }

    db.users = db.users.filter(u => u.id !== id);
    writeDb(db);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
