export default function handler(req, res) {
    if (req.method === "POST") {
      const { username, password } = req.body;
  
      if (username === "admin" && password === "admin123") {
        return res.status(200).json({ message: "Login successful" });
      }
  
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    res.status(405).json({ message: "Method not allowed" });
  }
  