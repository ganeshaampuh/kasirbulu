'use client'

import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/lib/auth";

import Navbar from "@/components/Navbar";

import ScrollToTop from "@/components/ScrollToTop";

import AuthRedirector from "@/components/AuthRedirector";



const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html lang="en">

      <body className={inter.className}>

        <AuthProvider>

          <AuthRedirector />

          <ScrollToTop />

          <Navbar />

          {children}

        </AuthProvider>

      </body>

    </html>

  );

}
