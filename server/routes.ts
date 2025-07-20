import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProfileSchema,
  insertPropertySchema,
  insertRatingCriteriaSchema,
  insertChecklistItemSchema,
  insertPropertyVisitSchema,
  insertFavoriteSchema,
  loginSchema,
  type Profile
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getProfileByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertProfileSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getProfileByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createProfile(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Profile routes
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      const profilesWithoutPasswords = profiles.map(({ password, ...profile }) => profile);
      res.json(profilesWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      const { password: _, ...profileWithoutPassword } = profile;
      res.json(profileWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const updateData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(req.params.id, updateData);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      const { password: _, ...profileWithoutPassword } = profile;
      res.json(profileWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const { userId } = req.query;
      let properties;
      
      if (userId) {
        // Get properties for specific user
        properties = await storage.getPropertiesByUser(userId as string);
      } else {
        // Admin route - get all properties
        properties = await storage.getAllProperties();
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const updateData = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(req.params.id, updateData);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProperty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Rating criteria routes
  app.get("/api/rating-criteria", async (req, res) => {
    try {
      const criteria = await storage.getAllRatingCriteria();
      res.json(criteria);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rating criteria" });
    }
  });

  app.post("/api/rating-criteria", async (req, res) => {
    try {
      const criteriaData = insertRatingCriteriaSchema.parse(req.body);
      const criteria = await storage.createRatingCriteria(criteriaData);
      res.status(201).json(criteria);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/rating-criteria/:id", async (req, res) => {
    try {
      const updateData = insertRatingCriteriaSchema.partial().parse(req.body);
      const criteria = await storage.updateRatingCriteria(req.params.id, updateData);
      if (!criteria) {
        return res.status(404).json({ message: "Rating criteria not found" });
      }
      res.json(criteria);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/rating-criteria/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRatingCriteria(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Rating criteria not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete rating criteria" });
    }
  });

  // Checklist items routes
  app.get("/api/checklist-items", async (req, res) => {
    try {
      const items = await storage.getAllChecklistItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch checklist items" });
    }
  });

  app.post("/api/checklist-items", async (req, res) => {
    try {
      const itemData = insertChecklistItemSchema.parse(req.body);
      const item = await storage.createChecklistItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/checklist-items/:id", async (req, res) => {
    try {
      const updateData = insertChecklistItemSchema.partial().parse(req.body);
      const item = await storage.updateChecklistItem(req.params.id, updateData);
      if (!item) {
        return res.status(404).json({ message: "Checklist item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/checklist-items/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteChecklistItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Checklist item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete checklist item" });
    }
  });

  // Property visits routes
  app.get("/api/visits", async (req, res) => {
    try {
      const visits = await storage.getAllPropertyVisits();
      res.json(visits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visits" });
    }
  });

  app.get("/api/visits/:id", async (req, res) => {
    try {
      const visit = await storage.getPropertyVisit(req.params.id);
      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }
      res.json(visit);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visit" });
    }
  });

  app.get("/api/properties/:id/visits", async (req, res) => {
    try {
      const visits = await storage.getVisitsByProperty(req.params.id);
      res.json(visits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property visits" });
    }
  });

  app.post("/api/visits", async (req, res) => {
    try {
      const visitData = insertPropertyVisitSchema.parse(req.body);
      const visit = await storage.createPropertyVisit(visitData);
      res.status(201).json(visit);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/visits/:id", async (req, res) => {
    try {
      const updateData = insertPropertyVisitSchema.partial().parse(req.body);
      const visit = await storage.updatePropertyVisit(req.params.id, updateData);
      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }
      res.json(visit);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/visits/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePropertyVisit(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Visit not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete visit" });
    }
  });

  // Favorites routes
  app.get("/api/users/:userId/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavoritesByUser(req.params.userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/favorites/:userId/:propertyId", async (req, res) => {
    try {
      const deleted = await storage.removeFavorite(req.params.userId, req.params.propertyId);
      if (!deleted) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Statistics route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
