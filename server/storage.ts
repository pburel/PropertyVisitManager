import { 
  profiles, 
  properties, 
  ratingCriteria, 
  checklistItems, 
  propertyVisits, 
  favorites,
  type Profile, 
  type InsertProfile,
  type Property,
  type InsertProperty,
  type RatingCriteria,
  type InsertRatingCriteria,
  type ChecklistItem,
  type InsertChecklistItem,
  type PropertyVisit,
  type InsertPropertyVisit,
  type Favorite,
  type InsertFavorite
} from "@shared/schema";

export interface IStorage {
  // Profile operations
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  getAllProfiles(): Promise<Profile[]>;

  // Property operations
  getProperty(id: string): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByUser(userId: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;

  // Rating criteria operations
  getAllRatingCriteria(): Promise<RatingCriteria[]>;
  getRatingCriteria(id: string): Promise<RatingCriteria | undefined>;
  createRatingCriteria(criteria: InsertRatingCriteria): Promise<RatingCriteria>;
  updateRatingCriteria(id: string, criteria: Partial<InsertRatingCriteria>): Promise<RatingCriteria | undefined>;
  deleteRatingCriteria(id: string): Promise<boolean>;

  // Checklist items operations
  getAllChecklistItems(): Promise<ChecklistItem[]>;
  getChecklistItem(id: string): Promise<ChecklistItem | undefined>;
  createChecklistItem(item: InsertChecklistItem): Promise<ChecklistItem>;
  updateChecklistItem(id: string, item: Partial<InsertChecklistItem>): Promise<ChecklistItem | undefined>;
  deleteChecklistItem(id: string): Promise<boolean>;

  // Property visits operations
  getPropertyVisit(id: string): Promise<PropertyVisit | undefined>;
  getAllPropertyVisits(): Promise<PropertyVisit[]>;
  getVisitsByUser(userId: string): Promise<PropertyVisit[]>;
  getVisitsByProperty(propertyId: string): Promise<PropertyVisit[]>;
  createPropertyVisit(visit: InsertPropertyVisit): Promise<PropertyVisit>;
  updatePropertyVisit(id: string, visit: Partial<InsertPropertyVisit>): Promise<PropertyVisit | undefined>;
  deletePropertyVisit(id: string): Promise<boolean>;

  // Favorites operations
  getFavoritesByUser(userId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, propertyId: string): Promise<boolean>;

  // Statistics
  getStats(): Promise<{
    totalUsers: number;
    totalProperties: number;
    totalVisits: number;
    averageRating: number;
  }>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;
  private properties: Map<string, Property>;
  private ratingCriteria: Map<string, RatingCriteria>;
  private checklistItems: Map<string, ChecklistItem>;
  private propertyVisits: Map<string, PropertyVisit>;
  private favorites: Map<string, Favorite>;

  constructor() {
    this.profiles = new Map();
    this.properties = new Map();
    this.ratingCriteria = new Map();
    this.checklistItems = new Map();
    this.propertyVisits = new Map();
    this.favorites = new Map();

    // Initialize with default data
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Create admin user
    const adminId = this.generateId();
    const admin: Profile = {
      id: adminId,
      fullName: "Admin User",
      email: "admin@propertyvisit.com",
      password: "admin123",
      avatarUrl: null,
      role: "admin",
      createdAt: new Date(),
    };
    this.profiles.set(adminId, admin);

    // Create demo user
    const demoUserId = this.generateId();
    const demoUser: Profile = {
      id: demoUserId,
      fullName: "Demo User",
      email: "demo@propertyvisit.com",
      password: "demo123",
      avatarUrl: null,
      role: "user",
      createdAt: new Date(),
    };
    this.profiles.set(demoUserId, demoUser);

    // Create demo property for demo user
    const demoPropertyId = this.generateId();
    const demoProperty: Property = {
      id: demoPropertyId,
      address: "123 Demo Street",
      city: "Demo City",
      postalCode: "12345",
      country: "Demo Country",
      propertyType: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      squareMeters: 85,
      price: "$350,000",
      description: "A beautiful 2-bedroom apartment perfect for property evaluation demonstrations. Features modern amenities and great natural light.",
      imageUrls: null,
      metadata: {},
      createdBy: demoUserId,
      createdAt: new Date(),
    };
    this.properties.set(demoPropertyId, demoProperty);

    // Create demo visit for the demo property
    const demoVisitId = this.generateId();
    const demoVisit: Visit = {
      id: demoVisitId,
      propertyId: demoPropertyId,
      userId: demoUserId,
      visitDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      overallScore: "4.2",
      notes: "Great property with excellent luminosity. Minor issues with ambient noise from nearby street. Overall very promising for the price range.",
      ratings: {
        luminosity: 5,
        ambientNoise: 3,
        thermalInsulation: 4,
        generalCondition: 4,
        equipmentState: 4,
        neighborhoodSecurity: 5,
        accessibility: 4,
        renovationPotential: 3,
        valueForMoney: 5
      },
      checklist: {
        moldPresence: false,
        cleanliness: true,
        windowFunctionality: true,
        floorCondition: true,
        odorAbsence: true,
        wallState: true,
        roomLighting: true,
        internetConnectivity: true
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    };
    this.visits.set(demoVisitId, demoVisit);

    // Create default rating criteria
    const defaultRatings = [
      { key: "luminosity", name: "Luminosity", description: "Natural and artificial lighting quality" },
      { key: "ambientNoise", name: "Ambient Noise", description: "Noise levels from surroundings" },
      { key: "thermalInsulation", name: "Thermal Insulation", description: "Temperature control and insulation" },
      { key: "generalCondition", name: "General Condition", description: "Overall property condition" },
      { key: "equipmentState", name: "Equipment State", description: "Condition of appliances and fixtures" },
      { key: "neighborhoodSecurity", name: "Neighborhood Security", description: "Safety and security of the area" },
      { key: "accessibility", name: "Accessibility", description: "Ease of access and mobility" },
      { key: "renovationPotential", name: "Renovation Potential", description: "Potential for improvements" },
      { key: "valueForMoney", name: "Value for Money", description: "Price relative to quality and features" },
    ];

    defaultRatings.forEach(rating => {
      const id = this.generateId();
      this.ratingCriteria.set(id, {
        id,
        ...rating,
        isActive: true,
        createdAt: new Date(),
      });
    });

    // Create default checklist items
    const defaultChecklist = [
      { key: "moldPresence", name: "Mold Presence", description: "Check for signs of mold or moisture damage" },
      { key: "cleanliness", name: "Cleanliness", description: "Overall cleanliness of the property" },
      { key: "windowFunctionality", name: "Window Functionality", description: "Windows open and close properly" },
      { key: "floorCondition", name: "Floor Condition", description: "Condition of flooring throughout" },
      { key: "odorAbsence", name: "Odor Absence", description: "No unpleasant odors present" },
      { key: "wallState", name: "Wall State", description: "Condition of walls and paint" },
      { key: "roomLighting", name: "Room Lighting", description: "Adequate lighting in all rooms" },
      { key: "internetConnectivity", name: "Internet Connectivity", description: "Internet connection available" },
    ];

    defaultChecklist.forEach(item => {
      const id = this.generateId();
      this.checklistItems.set(id, {
        id,
        ...item,
        isActive: true,
        createdAt: new Date(),
      });
    });

    // Create sample properties and visits
    this.createSampleData();
  }

  private createSampleData() {
    // Create sample users
    const users = [
      { fullName: "Sarah Johnson", email: "sarah@example.com", password: "password123", role: "user" },
      { fullName: "Michael Chen", email: "michael@example.com", password: "password123", role: "user" },
      { fullName: "Emma Davis", email: "emma@example.com", password: "password123", role: "user" },
    ];

    const userIds = users.map(user => {
      const id = this.generateId();
      this.profiles.set(id, {
        id,
        ...user,
        avatarUrl: null,
        createdAt: new Date(),
      });
      return id;
    });

    // Create sample properties
    const properties = [
      {
        address: "123 Maple Street",
        city: "Downtown District",
        postalCode: "H3A 1B2",
        country: "Canada",
        propertyType: "2-Bedroom Apartment",
        price: "2400",
        bedrooms: 2,
        bathrooms: 1,
        squareMeters: 75,
        imageUrls: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        description: "Modern apartment with excellent natural light",
        createdBy: userIds[0],
      },
      {
        address: "456 Oak Avenue",
        city: "Riverside Heights",
        postalCode: "H3B 2C3",
        country: "Canada",
        propertyType: "3-Bedroom House",
        price: "3200",
        bedrooms: 3,
        bathrooms: 2,
        squareMeters: 120,
        imageUrls: [
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        description: "Spacious family home with garden",
        createdBy: userIds[1],
      },
      {
        address: "789 Pine Road",
        city: "Garden Valley",
        postalCode: "H3C 3D4",
        country: "Canada",
        propertyType: "1-Bedroom Condo",
        price: "1800",
        bedrooms: 1,
        bathrooms: 1,
        squareMeters: 55,
        imageUrls: [
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        description: "Cozy condo with city views",
        createdBy: userIds[2],
      },
    ];

    const propertyIds = properties.map(property => {
      const id = this.generateId();
      this.properties.set(id, {
        id,
        ...property,
        createdAt: new Date(),
        metadata: null,
      });
      return id;
    });

    // Create sample visits
    const visits = [
      {
        userId: userIds[0],
        propertyId: propertyIds[0],
        visitDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        overallScore: "4.2",
        notes: "Beautiful apartment with excellent natural light throughout the day. The living room is spacious and well-ventilated. Kitchen appliances are modern and in good working condition. However, some minor issues with the flooring in the bedroom need attention. The building has good security and the neighborhood feels safe. Overall, great value for the price point in this area.",
        ratings: {
          luminosity: 4.5,
          ambientNoise: 3.8,
          thermalInsulation: 4.0,
          generalCondition: 4.2,
          equipmentState: 3.9,
          neighborhoodSecurity: 4.3,
          accessibility: 4.1,
          renovationPotential: 3.7,
          valueForMoney: 4.4
        },
        checklist: {
          moldPresence: true,
          cleanliness: true,
          windowFunctionality: true,
          floorCondition: false,
          odorAbsence: true,
          wallState: true,
          roomLighting: true,
          internetConnectivity: false
        }
      },
      {
        userId: userIds[1],
        propertyId: propertyIds[1],
        visitDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        overallScore: "3.8",
        notes: "Nice family home but needs some maintenance work.",
        ratings: {
          luminosity: 3.5,
          ambientNoise: 4.2,
          thermalInsulation: 3.6,
          generalCondition: 3.9,
          equipmentState: 3.7,
          neighborhoodSecurity: 4.0,
          accessibility: 3.8,
          renovationPotential: 4.1,
          valueForMoney: 3.4
        },
        checklist: {
          moldPresence: true,
          cleanliness: false,
          windowFunctionality: true,
          floorCondition: true,
          odorAbsence: false,
          wallState: true,
          roomLighting: false,
          internetConnectivity: true
        }
      },
      {
        userId: userIds[2],
        propertyId: propertyIds[2],
        visitDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        overallScore: "4.6",
        notes: "Excellent condo with amazing views and modern amenities.",
        ratings: {
          luminosity: 4.8,
          ambientNoise: 4.3,
          thermalInsulation: 4.7,
          generalCondition: 4.5,
          equipmentState: 4.6,
          neighborhoodSecurity: 4.4,
          accessibility: 4.7,
          renovationPotential: 4.2,
          valueForMoney: 4.8
        },
        checklist: {
          moldPresence: true,
          cleanliness: true,
          windowFunctionality: true,
          floorCondition: true,
          odorAbsence: true,
          wallState: true,
          roomLighting: true,
          internetConnectivity: false
        }
      }
    ];

    visits.forEach(visit => {
      const id = this.generateId();
      this.propertyVisits.set(id, {
        id,
        ...visit,
        createdAt: new Date(),
      });
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Profile operations
  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.email === email);
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.generateId();
    const newProfile: Profile = {
      ...profile,
      id,
      createdAt: new Date(),
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...profile };
    this.profiles.set(id, updated);
    return updated;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  // Property operations
  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertiesByUser(userId: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => property.createdBy === userId);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.generateId();
    const newProperty: Property = {
      ...property,
      id,
      createdAt: new Date(),
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...property };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Rating criteria operations
  async getAllRatingCriteria(): Promise<RatingCriteria[]> {
    return Array.from(this.ratingCriteria.values());
  }

  async getRatingCriteria(id: string): Promise<RatingCriteria | undefined> {
    return this.ratingCriteria.get(id);
  }

  async createRatingCriteria(criteria: InsertRatingCriteria): Promise<RatingCriteria> {
    const id = this.generateId();
    const newCriteria: RatingCriteria = {
      ...criteria,
      id,
      createdAt: new Date(),
    };
    this.ratingCriteria.set(id, newCriteria);
    return newCriteria;
  }

  async updateRatingCriteria(id: string, criteria: Partial<InsertRatingCriteria>): Promise<RatingCriteria | undefined> {
    const existing = this.ratingCriteria.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...criteria };
    this.ratingCriteria.set(id, updated);
    return updated;
  }

  async deleteRatingCriteria(id: string): Promise<boolean> {
    return this.ratingCriteria.delete(id);
  }

  // Checklist items operations
  async getAllChecklistItems(): Promise<ChecklistItem[]> {
    return Array.from(this.checklistItems.values());
  }

  async getChecklistItem(id: string): Promise<ChecklistItem | undefined> {
    return this.checklistItems.get(id);
  }

  async createChecklistItem(item: InsertChecklistItem): Promise<ChecklistItem> {
    const id = this.generateId();
    const newItem: ChecklistItem = {
      ...item,
      id,
      createdAt: new Date(),
    };
    this.checklistItems.set(id, newItem);
    return newItem;
  }

  async updateChecklistItem(id: string, item: Partial<InsertChecklistItem>): Promise<ChecklistItem | undefined> {
    const existing = this.checklistItems.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...item };
    this.checklistItems.set(id, updated);
    return updated;
  }

  async deleteChecklistItem(id: string): Promise<boolean> {
    return this.checklistItems.delete(id);
  }

  // Property visits operations
  async getPropertyVisit(id: string): Promise<PropertyVisit | undefined> {
    return this.propertyVisits.get(id);
  }

  async getAllPropertyVisits(): Promise<PropertyVisit[]> {
    return Array.from(this.propertyVisits.values());
  }

  async getVisitsByUser(userId: string): Promise<PropertyVisit[]> {
    return Array.from(this.propertyVisits.values()).filter(visit => visit.userId === userId);
  }

  async getVisitsByProperty(propertyId: string): Promise<PropertyVisit[]> {
    return Array.from(this.propertyVisits.values()).filter(visit => visit.propertyId === propertyId);
  }

  async createPropertyVisit(visit: InsertPropertyVisit): Promise<PropertyVisit> {
    const id = this.generateId();
    const newVisit: PropertyVisit = {
      ...visit,
      id,
      createdAt: new Date(),
    };
    this.propertyVisits.set(id, newVisit);
    return newVisit;
  }

  async updatePropertyVisit(id: string, visit: Partial<InsertPropertyVisit>): Promise<PropertyVisit | undefined> {
    const existing = this.propertyVisits.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...visit };
    this.propertyVisits.set(id, updated);
    return updated;
  }

  async deletePropertyVisit(id: string): Promise<boolean> {
    return this.propertyVisits.delete(id);
  }

  // Favorites operations
  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const key = `${favorite.userId}-${favorite.propertyId}`;
    const newFavorite: Favorite = {
      ...favorite,
      createdAt: new Date(),
    };
    this.favorites.set(key, newFavorite);
    return newFavorite;
  }

  async removeFavorite(userId: string, propertyId: string): Promise<boolean> {
    const key = `${userId}-${propertyId}`;
    return this.favorites.delete(key);
  }

  // Statistics
  async getStats(): Promise<{
    totalUsers: number;
    totalProperties: number;
    totalVisits: number;
    averageRating: number;
  }> {
    const visits = Array.from(this.propertyVisits.values());
    const totalRating = visits.reduce((sum, visit) => {
      return sum + (parseFloat(visit.overallScore || "0"));
    }, 0);
    
    return {
      totalUsers: this.profiles.size,
      totalProperties: this.properties.size,
      totalVisits: this.propertyVisits.size,
      averageRating: visits.length > 0 ? totalRating / visits.length : 0,
    };
  }
}

export const storage = new MemStorage();
