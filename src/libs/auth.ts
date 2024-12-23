import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		accessToken: string;
		refreshToken: string;
		user: {
			_id: string;
			name: string;
			email: string;
			role: string;
		};
	}

	interface User {
		access_token: string;
		refresh_token: string;
		_id: string;
		name: string;
		email: string;
		role: string;
	}
}

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},

	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "Jhondoe" },
				password: { label: "Password", type: "password" },
				username: { label: "Username", type: "text", placeholder: "Jhon Doe" },
			},

			async authorize(credentials): Promise<any> {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Please enter an email or password");
				}
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
						}),
					}
				);
				const data = await res.json();

				if (!data || !data.token) {
					throw new Error("No user found");
				}

				return {
					access_token: data.token,
					_id: data.userId,
					email: data.email,
					name: "",
					role: "",
				};
			},
		}),
	],

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.access_token;
				token.refreshToken = user.refresh_token;
				token.role = user.role;
				token.userId = user._id;
			}
			return token;
		},

		async session({ session, token }) {
			if (session?.user) {
				session.accessToken = token.accessToken as string;
				session.refreshToken = token.refreshToken as string;
				session.user.role = token.role as string;
				session.user._id = token.userId as string;

				if (typeof window !== "undefined") {
					localStorage.setItem("accessToken", session.accessToken);
					localStorage.setItem("refreshToken", session.refreshToken);
					localStorage.setItem("userRole", session.user.role);
					localStorage.setItem("userId", session.user._id); // Add user ID to localStorage
				}
			}
			return session;
		},
	},
};

export const getAuthSession = async () => {
	return getServerSession(authOptions);
};