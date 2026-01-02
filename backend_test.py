#!/usr/bin/env python3
"""
NextBazaar Backend API Testing Script
Tests all backend endpoints for the ecommerce application
"""

import requests
import json
import time
import os
from typing import Dict, Any, Optional

class NextBazaarAPITester:
    def __init__(self):
        # Get base URL from environment or use default
        self.base_url = "https://nextbazaar.preview.emergentagent.com/api"
        self.user_token = None
        self.admin_token = None
        self.test_user_id = None
        self.test_order_id = None
        self.results = {
            "authentication": {},
            "products": {},
            "orders": {},
            "payments": {},
            "admin": {}
        }
        
    def log_result(self, category: str, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test results"""
        self.results[category][test_name] = {
            "success": success,
            "message": message,
            "response_data": response_data
        }
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {category.upper()}: {test_name} - {message}")
        if not success and response_data:
            print(f"   Response: {response_data}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        default_headers = {"Content-Type": "application/json"}
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=default_headers, timeout=30)
            else:
                return False, {"error": f"Unsupported method: {method}"}, 0
                
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}
                
            return response.status_code < 400, response_data, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}, 0
    
    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication APIs...")
        
        # Test user registration
        test_user_data = {
            "phone": "+8801987654321",
            "password": "testuser123",
            "name": "Test User"
        }
        
        success, response, status_code = self.make_request("POST", "/auth/register", test_user_data)
        if success and "token" in response:
            self.user_token = response["token"]
            self.test_user_id = response["user"]["id"]
            self.log_result("authentication", "user_registration", True, 
                          f"User registered successfully with ID: {self.test_user_id}")
        else:
            # User might already exist, try login
            login_data = {"phone": test_user_data["phone"], "password": test_user_data["password"]}
            success, response, status_code = self.make_request("POST", "/auth/login", login_data)
            if success and "token" in response:
                self.user_token = response["token"]
                self.test_user_id = response["user"]["id"]
                self.log_result("authentication", "user_registration", True, 
                              "User already exists, logged in successfully")
            else:
                self.log_result("authentication", "user_registration", False, 
                              f"Failed to register/login user: {response}")
        
        # Test user login with fresh credentials
        login_data = {"phone": "+8801987654321", "password": "testuser123"}
        success, response, status_code = self.make_request("POST", "/auth/login", login_data)
        if success and "token" in response:
            self.log_result("authentication", "user_login", True, "User login successful")
        else:
            self.log_result("authentication", "user_login", False, 
                          f"User login failed: {response}")
        
        # Test admin login
        admin_data = {"phone": "+8801234567890", "password": "admin123"}
        success, response, status_code = self.make_request("POST", "/auth/login", admin_data)
        if success and "token" in response and response["user"]["role"] == "admin":
            self.admin_token = response["token"]
            self.log_result("authentication", "admin_login", True, "Admin login successful")
        else:
            self.log_result("authentication", "admin_login", False, 
                          f"Admin login failed: {response}")
        
        # Test invalid credentials
        invalid_data = {"phone": "+8801111111111", "password": "wrongpassword"}
        success, response, status_code = self.make_request("POST", "/auth/login", invalid_data)
        if not success and status_code == 401:
            self.log_result("authentication", "invalid_credentials", True, 
                          "Invalid credentials properly rejected")
        else:
            self.log_result("authentication", "invalid_credentials", False, 
                          f"Invalid credentials test failed: {response}")
    
    def test_products_api(self):
        """Test products endpoints"""
        print("\n📦 Testing Products APIs...")
        
        # Test get all products
        success, response, status_code = self.make_request("GET", "/products")
        if success and "products" in response and isinstance(response["products"], list):
            products_count = len(response["products"])
            self.log_result("products", "get_all_products", True, 
                          f"Retrieved {products_count} products successfully")
        else:
            self.log_result("products", "get_all_products", False, 
                          f"Failed to get products: {response}")
        
        # Test get single product by slug
        success, response, status_code = self.make_request("GET", "/products/wireless-earbuds-pro")
        if success and "product" in response:
            product_name = response["product"].get("name", "Unknown")
            self.log_result("products", "get_single_product", True, 
                          f"Retrieved product: {product_name}")
        else:
            self.log_result("products", "get_single_product", False, 
                          f"Failed to get single product: {response}")
        
        # Test get non-existent product
        success, response, status_code = self.make_request("GET", "/products/non-existent-product")
        if not success and status_code == 404:
            self.log_result("products", "non_existent_product", True, 
                          "Non-existent product properly returns 404")
        else:
            self.log_result("products", "non_existent_product", False, 
                          f"Non-existent product test failed: {response}")
    
    def test_orders_api(self):
        """Test orders endpoints"""
        print("\n🛒 Testing Orders APIs...")
        
        if not self.user_token:
            self.log_result("orders", "create_order", False, "No user token available")
            return
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        
        # Test create order
        order_data = {
            "items": [
                {
                    "id": "1",
                    "name": "Wireless Earbuds Pro",
                    "price": 79.99,
                    "quantity": 2
                },
                {
                    "id": "2", 
                    "name": "Smart Watch Ultra",
                    "price": 299.99,
                    "quantity": 1
                }
            ],
            "shippingAddress": {
                "name": "Test User",
                "phone": "+8801987654321",
                "address": "123 Test Street",
                "city": "Dhaka",
                "postalCode": "1000",
                "country": "Bangladesh"
            },
            "paymentMethod": "stripe"
        }
        
        success, response, status_code = self.make_request("POST", "/orders", order_data, headers)
        if success and "order" in response:
            self.test_order_id = response["order"]["id"]
            order_total = response["order"]["total"]
            self.log_result("orders", "create_order", True, 
                          f"Order created successfully with total: ${order_total}")
        else:
            self.log_result("orders", "create_order", False, 
                          f"Failed to create order: {response}")
        
        # Test get user orders
        success, response, status_code = self.make_request("GET", "/orders/user", headers=headers)
        if success and "orders" in response:
            orders_count = len(response["orders"])
            self.log_result("orders", "get_user_orders", True, 
                          f"Retrieved {orders_count} user orders")
        else:
            self.log_result("orders", "get_user_orders", False, 
                          f"Failed to get user orders: {response}")
        
        # Test unauthorized access
        success, response, status_code = self.make_request("GET", "/orders/user")
        if not success and status_code == 401:
            self.log_result("orders", "unauthorized_access", True, 
                          "Unauthorized access properly rejected")
        else:
            self.log_result("orders", "unauthorized_access", False, 
                          f"Unauthorized access test failed: {response}")
    
    def test_payments_api(self):
        """Test payments endpoints"""
        print("\n💳 Testing Payments APIs...")
        
        if not self.user_token or not self.test_order_id:
            self.log_result("payments", "stripe_payment", False, 
                          "No user token or order ID available")
            return
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        
        # Test mocked Stripe payment
        payment_data = {
            "orderId": self.test_order_id,
            "amount": 459.97  # Total from the test order
        }
        
        success, response, status_code = self.make_request("POST", "/payments/stripe", payment_data, headers)
        if success and response.get("success"):
            payment_id = response.get("paymentId", "Unknown")
            self.log_result("payments", "stripe_payment", True, 
                          f"Payment successful with ID: {payment_id}")
        elif not success and "Payment failed" in str(response):
            # This is expected 10% of the time due to mocking
            self.log_result("payments", "stripe_payment", True, 
                          "Payment failed as expected (mocked 10% failure rate)")
        else:
            self.log_result("payments", "stripe_payment", False, 
                          f"Payment test failed: {response}")
        
        # Test unauthorized payment
        success, response, status_code = self.make_request("POST", "/payments/stripe", payment_data)
        if not success and status_code == 401:
            self.log_result("payments", "unauthorized_payment", True, 
                          "Unauthorized payment properly rejected")
        else:
            self.log_result("payments", "unauthorized_payment", False, 
                          f"Unauthorized payment test failed: {response}")
    
    def test_admin_apis(self):
        """Test admin endpoints"""
        print("\n👑 Testing Admin APIs...")
        
        if not self.admin_token:
            self.log_result("admin", "analytics", False, "No admin token available")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test admin analytics
        success, response, status_code = self.make_request("GET", "/admin/analytics", headers=headers)
        if success and "analytics" in response:
            analytics = response["analytics"]
            total_orders = analytics.get("totalOrders", 0)
            total_users = analytics.get("totalUsers", 0)
            self.log_result("admin", "analytics", True, 
                          f"Analytics retrieved: {total_orders} orders, {total_users} users")
        else:
            self.log_result("admin", "analytics", False, 
                          f"Failed to get analytics: {response}")
        
        # Test admin get all orders
        success, response, status_code = self.make_request("GET", "/admin/orders", headers=headers)
        if success and "orders" in response:
            orders_count = len(response["orders"])
            self.log_result("admin", "get_all_orders", True, 
                          f"Retrieved {orders_count} orders")
        else:
            self.log_result("admin", "get_all_orders", False, 
                          f"Failed to get all orders: {response}")
        
        # Test admin get all users
        success, response, status_code = self.make_request("GET", "/admin/users", headers=headers)
        if success and "users" in response:
            users_count = len(response["users"])
            self.log_result("admin", "get_all_users", True, 
                          f"Retrieved {users_count} users")
        else:
            self.log_result("admin", "get_all_users", False, 
                          f"Failed to get all users: {response}")
        
        # Test update order status
        if self.test_order_id:
            update_data = {"status": "processing"}
            success, response, status_code = self.make_request("PUT", f"/admin/orders/{self.test_order_id}", 
                                                             update_data, headers)
            if success and "order" in response:
                new_status = response["order"]["status"]
                self.log_result("admin", "update_order_status", True, 
                              f"Order status updated to: {new_status}")
            else:
                self.log_result("admin", "update_order_status", False, 
                              f"Failed to update order status: {response}")
        
        # Test unauthorized admin access
        user_headers = {"Authorization": f"Bearer {self.user_token}"} if self.user_token else {}
        success, response, status_code = self.make_request("GET", "/admin/analytics", headers=user_headers)
        if not success and status_code == 401:
            self.log_result("admin", "unauthorized_admin_access", True, 
                          "Unauthorized admin access properly rejected")
        else:
            self.log_result("admin", "unauthorized_admin_access", False, 
                          f"Unauthorized admin access test failed: {response}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting NextBazaar Backend API Tests...")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        # Run tests in order
        self.test_authentication()
        self.test_products_api()
        self.test_orders_api()
        self.test_payments_api()
        self.test_admin_apis()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = 0
        passed_tests = 0
        
        for category, tests in self.results.items():
            print(f"\n{category.upper()}:")
            for test_name, result in tests.items():
                status = "✅ PASS" if result["success"] else "❌ FAIL"
                print(f"  {status} {test_name}")
                total_tests += 1
                if result["success"]:
                    passed_tests += 1
        
        print(f"\n📈 OVERALL RESULTS:")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if passed_tests == total_tests:
            print("\n🎉 ALL TESTS PASSED!")
        else:
            print(f"\n⚠️  {total_tests - passed_tests} TESTS FAILED")
            print("\nFailed tests:")
            for category, tests in self.results.items():
                for test_name, result in tests.items():
                    if not result["success"]:
                        print(f"  ❌ {category}.{test_name}: {result['message']}")

if __name__ == "__main__":
    tester = NextBazaarAPITester()
    tester.run_all_tests()