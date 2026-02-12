
const userData = {
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    password: "password123",
};

async function testRegister() {
    try {
        console.log("Testing Registration Endpoint...");
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);

        if (response.ok) {
            console.log("✅ Registration Successful!");
        } else {
            console.error("❌ Registration Failed");
        }

    } catch (error) {
        console.error("❌ Error connecting to server:", (error as Error).message);
        console.log("Make sure the Next.js server is running on port 3000!");
    }
}

testRegister();
