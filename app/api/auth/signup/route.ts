import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, name, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: false, // Only block if there's a non-deleted user with that email
    },
  });

  if (existingUser && existingUser.newAccount) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        name,
        password: hashed,
        newAccount: false,
      },
    });
    return NextResponse.json({ message: "User created", user: existingUser });
  }

  if (existingUser && existingUser.isDeleted === false) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }


  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      isDeleted: false, // Ensure it's explicitly set (in case default isn't set in schema)
    },
  });

  return NextResponse.json({ message: "User created", user });
}
