import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
} from "@/lib/auth";
import { sampleProducts } from "@/lib/sample-data";
import { v4 as uuidv4 } from "uuid";

// Helper to get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token) as { userId: string } | null;
  if (!decoded) return null;

  const db = await getDb();
  const user = await db.collection("users").findOne({ id: decoded.userId });
  return user;
}

// GET Handler
export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);

  try {
    // Root API
    if (pathname === "/api/" || pathname === "/api") {
      return NextResponse.json({ message: "Ecommerce API is running!" });
    }

    // Get all products
    if (pathname === "/api/products") {
      const db = await getDb();
      let products = await db.collection("products").find({}).toArray();

      // Seed sample data if empty
      if (products.length === 0) {
        await db.collection("products").insertMany(sampleProducts as any);
        products = sampleProducts as any;
      }

      return NextResponse.json({ products });
    }

    // Get single product by slug
    if (pathname.startsWith("/api/products/")) {
      const slug = pathname.split("/api/products/")[1];
      const db = await getDb();
      const product = await db.collection("products").findOne({ slug });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ product });
    }

    // Get user orders
    if (pathname === "/api/orders/user") {
      const user = await getUserFromToken(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const db = await getDb();
      const orders = await db
        .collection("orders")
        .find({ userId: user.id })
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({ orders });
    }

    // Get all orders (admin)
    if (pathname === "/api/admin/orders") {
      const user = await getUserFromToken(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const db = await getDb();
      const orders = await db
        .collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({ orders });
    }

    // Get user profile
    if (pathname === "/api/user/profile") {
      const user = await getUserFromToken(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { password, ...userWithoutPassword } = user;
      return NextResponse.json({ user: userWithoutPassword });
    }

    // Admin: Get all users
    if (pathname === "/api/admin/users") {
      const user = await getUserFromToken(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const db = await getDb();
      const users = await db
        .collection("users")
        .find({})
        .project({ password: 0 })
        .toArray();

      return NextResponse.json({ users });
    }

    // Admin: Analytics
    if (pathname === "/api/admin/analytics") {
      const user = await getUserFromToken(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const db = await getDb();
      const totalOrders = await db.collection("orders").countDocuments();
      const totalUsers = await db.collection("users").countDocuments();
      const totalProducts = await db.collection("products").countDocuments();

      const orders = await db.collection("orders").find({}).toArray();
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0,
      );
      const pendingOrders = orders.filter((o) => o.status === "pending").length;

      return NextResponse.json({
        analytics: {
          totalOrders,
          totalUsers,
          totalProducts,
          totalRevenue,
          pendingOrders,
        },
      });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Handler
export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);

  try {
    const body = await request.json();

    // Register
    if (pathname === "/api/auth/register") {
      const { phone, password, name } = body;

      if (!phone || !password) {
        return NextResponse.json(
          { error: "Phone and password required" },
          { status: 400 },
        );
      }

      const db = await getDb();
      const existingUser = await db.collection("users").findOne({ phone });

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 },
        );
      }

      const hashedPassword = await hashPassword(password);
      const user = {
        id: uuidv4(),
        phone,
        password: hashedPassword,
        name: name || "User",
        role: "user",
        createdAt: new Date().toISOString(),
      };

      await db.collection("users").insertOne(user);

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({ token, user: userWithoutPassword });
    }

    // Login
    if (pathname === "/api/auth/login") {
      const { phone, password } = body;

      if (!phone || !password) {
        return NextResponse.json(
          { error: "Phone and password required" },
          { status: 400 },
        );
      }

      const db = await getDb();
      const user = await db.collection("users").findOne({ phone });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      const isValid = await verifyPassword(password, user.password);

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({ token, user: userWithoutPassword });
    }

    // Create order
    if (pathname === "/api/orders") {
      const user = await getUserFromToken(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { items, shippingAddress, paymentMethod } = body;

      if (!items || items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );
      const shipping = subtotal > 100 ? 0 : 10;
      const total = subtotal + shipping;

      const order = {
        id: uuidv4(),
        userId: user.id,
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shipping,
        total,
        status: "pending",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
      };

      const db = await getDb();
      await db.collection("orders").insertOne(order);

      return NextResponse.json({ order });
    }

    // Mocked Stripe Payment
    if (pathname === "/api/payments/stripe") {
      const user = await getUserFromToken(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { orderId } = body;

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock success (90% success rate)
      const success = Math.random() > 0.1;

      if (success) {
        const db = await getDb();
        await db.collection("orders").updateOne(
          { id: orderId },
          {
            $set: {
              paymentStatus: "paid",
              status: "processing",
              paidAt: new Date().toISOString(),
              paymentId: `stripe_mock_${uuidv4()}`,
            },
          },
        );

        return NextResponse.json({
          success: true,
          paymentId: `stripe_mock_${uuidv4()}`,
          message: "Payment successful (MOCKED)",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Payment failed (MOCKED)",
          },
          { status: 400 },
        );
      }
    }

    // Admin: Create product
    if (pathname === "/api/admin/products") {
      const user = await getUserFromToken(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const product = {
        id: uuidv4(),
        ...body,
        slug: body.name.toLowerCase().replace(/\s+/g, "-"),
        createdAt: new Date().toISOString(),
      };

      const db = await getDb();
      await db.collection("products").insertOne(product);

      return NextResponse.json({ product });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT Handler
export async function PUT(request: NextRequest) {
  const { pathname } = new URL(request.url);

  try {
    const body = await request.json();

    // Update user profile
    if (pathname === "/api/user/profile") {
      const user = await getUserFromToken(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { name, phone } = body;
      const db = await getDb();

      await db
        .collection("users")
        .updateOne({ id: user.id }, { $set: { name, phone } });

      const updatedUser = await db.collection("users").findOne({ id: user.id });
      if (!updatedUser)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      const { password, ...userWithoutPassword } = updatedUser;

      return NextResponse.json({ user: userWithoutPassword });
    }

    // Change password
    if (pathname === "/api/user/password") {
      const user = await getUserFromToken(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { currentPassword, newPassword } = body;

      const isValid = await verifyPassword(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 },
        );
      }

      const hashedPassword = await hashPassword(newPassword);
      const db = await getDb();

      await db
        .collection("users")
        .updateOne({ id: user.id }, { $set: { password: hashedPassword } });

      return NextResponse.json({ message: "Password updated successfully" });
    }

    // Admin: Update order status
    if (pathname.startsWith("/api/admin/orders/")) {
      const user = await getUserFromToken(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const orderId = pathname.split("/api/admin/orders/")[1];
      const { status } = body;

      const db = await getDb();
      await db
        .collection("orders")
        .updateOne(
          { id: orderId },
          { $set: { status, updatedAt: new Date().toISOString() } },
        );

      const order = await db.collection("orders").findOne({ id: orderId });
      return NextResponse.json({ order });
    }

    // Admin: Update product
    if (pathname.startsWith("/api/admin/products/")) {
      const user = await getUserFromToken(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const productId = pathname.split("/api/admin/products/")[1];

      const db = await getDb();
      await db
        .collection("products")
        .updateOne(
          { id: productId },
          { $set: { ...body, updatedAt: new Date().toISOString() } },
        );

      const product = await db
        .collection("products")
        .findOne({ id: productId });
      return NextResponse.json({ product });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(request: NextRequest) {
  const { pathname } = new URL(request.url);

  try {
    // Admin: Delete product
    if (pathname.startsWith("/api/admin/products/")) {
      const user = await getUserFromToken(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const productId = pathname.split("/api/admin/products/")[1];

      const db = await getDb();
      await db.collection("products").deleteOne({ id: productId });

      return NextResponse.json({ message: "Product deleted" });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
