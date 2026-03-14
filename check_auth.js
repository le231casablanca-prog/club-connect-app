import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Read .env manually since we are in node
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

console.log('Testing connection to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Attempting to sign in with admin@clubconnect.fr...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@clubconnect.fr',
        password: 'admin1234'
    });

    if (signInError) {
        console.log('Sign in failed:', signInError.message);
        console.log('Attempting to sign up (register) the user...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'admin@clubconnect.fr',
            password: 'admin1234'
        });

        if (signUpError) {
            console.log('Sign up failed:', signUpError.message);
        } else {
            console.log('Sign up successful (or user already exists but requires confirmation):', signUpData);
        }
    } else {
        console.log('Sign in successful! Data:', signInData);
    }
}

test();
