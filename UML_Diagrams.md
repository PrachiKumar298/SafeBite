# SafeBite UML Diagrams

## 1. MAIN SYSTEM FLOWCHART

```
START
  |
  v
User Visits SafeBite
  |
  v
Authentication Check
  |
  +------- YES ------> Redirect to Dashboard
  |
  NO
  |
  v
Display Landing Page
  |
  v
User Action (SignUp/Login)
  |
  +--SignUp--> Registration Form --> Create Account --> Set Allergies
  |
  +--Login---> Login Form --> Verify Credentials --> Set Allergies
  |
  v
Dashboard
  |
  v
SELECT MODULE
  |
  +--> Allergies Management
  +--> Food Safety Checker
  +--> Medicine Checker
  +--> Browse Recipes
  +--> View Recommendations
  +--> User Profile
  |
  v
PROCESS REQUEST
  |
  +---> Query Database
  +---> Analyze Data
  +---> Generate Result
  +---> Apply Filters
  |
  v
Display Report/Result
  |
  v
User Action (Save/Continue/Logout)
  |
  v
END
```

## 2. ALLERGY MANAGEMENT MODULE FLOW

```
START: Allergy Management Module
  |
  v
Load User's Current Allergies
  |
  v
Display Allergen Selection UI
  |
  v
User Selects/Deselects Allergens
  |
  v
INPUT VALIDATION
  |
  +--> Valid? YES --> Continue
  |
  NO --> Show Error Message --> Loop Back
  |
  v
Prepare Data for Storage
  |
  v
DATABASE OPERATION
  |
  +--> Save Allergies to Database
  +--> Update User Profile
  +--> Trigger Recommendation Engine
  |
  v
CONFIRMATION
  |
  +--> Success? YES --> Show Success Message
  |
  NO --> Show Error Message
  |
  v
CACHE UPDATE
  |
  +--> Update Local Cache
  +--> Sync with Session
  |
  v
Return to Dashboard/Continue
  |
  v
END
```

## 3. FOOD SAFETY CHECKER FLOW

```
START: Food Safety Checker
  |
  v
User Input: Food/Product Name
  |
  v
INPUT VALIDATION
  |
  +--> Empty? YES --> Show Error
  |
  NO --> Continue
  |
  v
SEARCH FOOD DATABASE
  |
  +--> Query by Product Name
  +--> Fuzzy Matching (if exact not found)
  |
  v
MATCH FOUND?
  |
  +--> NO --> Show "Product Not Found"
  |
  YES --> Continue
  |
  v
RETRIEVE PRODUCT DATA
  |
  +--> Product Name
  +--> Ingredients List
  +--> Allergen Information
  +--> Manufacturer Details
  |
  v
ALLERGEN ANALYSIS
  |
  v
COMPARE WITH USER ALLERGIES
  |
  v
ALLERGEN MATCH FOUND?
  |
  +--> YES --> Generate WARNING Report
  |     |
  |     v
  |     Display Allergen Details
  |     Display Severity Level
  |     Display Alternative Products
  |
  NO --> Generate SAFE Report
      |
      v
      Confirm Safety Message
  |
  v
GENERATE FINAL REPORT
  |
  +--> Product Name
  +--> Safety Status (Safe/Unsafe)
  +--> Matched Allergens (if any)
  +--> Confidence Level
  |
  v
Display Result to User
  |
  v
USER ACTION
  |
  +--> Save Report
  +--> Share Report
  +--> New Search
  +--> Back to Dashboard
  |
  v
END
```

## 4. MEDICINE CHECKER FLOW

```
START: Medicine Checker
  |
  v
User Input: Medicine Name
  |
  v
SEARCH MEDICINE DATABASE
  |
  +--> Query by Medicine Name/Generic Name
  +--> Search by Drug ID
  |
  v
MEDICINE FOUND?
  |
  +--> NO --> Show "Medicine Not Found"
  |
  YES --> Continue
  |
  v
RETRIEVE MEDICINE DATA
  |
  +--> Medicine Name
  +--> Active Ingredients
  +--> Inactive Ingredients
  +--> Dosage Information
  +--> Side Effects
  +--> Drug Interactions
  |
  v
COMPATIBILITY CHECK
  |
  +---> Extract User Allergies
  +---> Query User's Medication List
  +---> Check for Allergic Components
  +---> Check for Drug Interactions
  |
  v
INCOMPATIBILITY FOUND?
  |
  +--> YES --> Generate ALERT Report
  |     |
  |     v
  |     Show Incompatible Allergen
  |     Show Severity Level
  |     Show Interaction Details
  |     Suggest Alternative Medicines
  |
  NO --> Generate SAFE Report
      |
      v
      Confirm Safety with Notes
  |
  v
GENERATE COMPATIBILITY REPORT
  |
  +--> Medicine Name
  +--> Status (Safe/Unsafe/Caution)
  +--> Risk Level
  +--> Interaction Details (if any)
  +--> Consultation Recommendation
  |
  v
Display Report to User
  |
  v
USER ACTION
  |
  +--> Save Report
  +--> Share with Doctor
  +--> New Search
  +--> Back to Dashboard
  |
  v
END
```

## 5. RECIPE DISCOVERY FLOW

```
START: Recipe Discovery Module
  |
  v
Display Recipe Home Page
  |
  v
FILTER OPTIONS DISPLAYED
  |
  +--> Allergen Filter
  +--> Cuisine Type Filter
  +--> Cooking Time Filter
  +--> Dietary Type Filter
  +--> Difficulty Level Filter
  |
  v
User Applies Filters
  |
  v
QUERY RECIPE DATABASE
  |
  +--> Select recipes matching filters
  +--> Apply User Allergen Exclusions
  +--> Sort by Relevance/Rating
  |
  v
FILTER RECIPES
  |
  +--> Remove recipes with user allergens
  +--> Cross-check ingredients against allergies
  |
  v
GENERATE SAFE RECIPE LIST
  |
  +--> Display 10-20 recipes per page
  +--> Show recipe name, image, rating
  +--> Display "Safe for You" badge
  |
  v
User Selects Recipe
  |
  v
LOAD RECIPE DETAILS
  |
  +--> Recipe Name
  +--> Ingredients List
  +--> Step-by-step Instructions
  +--> Cooking Time & Difficulty
  +--> Nutritional Information
  +--> Allergen Alert (if any)
  +--> User Reviews
  |
  v
USER ACTION
  |
  +--> SAVE RECIPE --> Add to Saved Recipes --> Update Profile
  |
  +--> VIEW NUTRITIONS --> Display Nutritional Breakdown
  |
  +--> SHARE --> Generate Shareable Link
  |
  +--> NEXT RECIPE --> Load Next Safe Recipe
  |
  v
Return to Recipe List or Dashboard
  |
  v
END
```

## 6. RECOMMENDATION ENGINE FLOW

```
START: Recommendation Engine
  |
  v
TRIGGER RECOMMENDATION REQUEST
  |
  +--> User navigates to Recommendations
  +--> Scheduled daily recommendations
  +--> After allergy update
  |
  v
COLLECT USER PROFILE DATA
  |
  +--> Extract User Allergies Profile
  +--> Fetch Saved Recipes History
  +--> Fetch Recent Searches
  +--> Retrieve User Preferences
  +--> Get Previous Recommendations (avoid repeat)
  |
  v
QUERY MULTIPLE DATABASES
  |
  +--> Recipe Database
  +--> Product Database
  +--> Medicine Database (related items)
  |
  v
APPLY SAFETY FILTERS
  |
  +--> Remove items with user allergens
  +--> Filter by dietary restrictions
  +--> Check availability/region
  |
  v
RANKING ALGORITHM
  |
  +--> Score by relevance to user profile
  +--> Boost newly added recipes
  +--> Consider user ratings/reviews
  +--> Weight by popularity
  +--> Factor in nutrition match
  |
  v
GENERATE RECOMMENDATION LIST
  |
  +--> Top 5-10 recommendations
  +--> Include reason for recommendation
  +--> Show confidence score
  |
  v
DIVERSITY CHECK
  |
  +--> Ensure variety in recommendations
  +--> Mix cuisines and types
  +--> Include different difficulty levels
  |
  v
PERSONALIZE FOR USER
  |
  +--> Add user-specific notes
  +--> Include tips based on allergies
  +--> Suggest shopping alternatives
  |
  v
Display Personalized Recommendations
  |
  v
USER INTERACTION
  |
  +--> LIKE --> Add to Preferences --> Boost Similar Items
  |
  +--> SAVE --> Add to Saved List --> Update Profile
  |
  +--> DISLIKE --> Mark as Not Interested
  |
  +--> SHARE --> Generate Shareable Card
  |
  +--> VIEW DETAILS --> Load Full Recipe/Product Details
  |
  v
FEEDBACK LOOP
  |
  +--> Record user interaction
  +--> Update recommendation model
  +--> Improve future suggestions
  |
  v
Return to Recommendations or Dashboard
  |
  v
END
```

## 7. USER AUTHENTICATION FLOW

```
START: Authentication
  |
  v
CHECK SESSION/TOKEN
  |
  +--> Valid Token? YES --> SKIP to Dashboard
  |
  NO or Expired --> Continue
  |
  v
Display Login/SignUp Choice
  |
  v
USER CHOICE
  |
  +--LOGIN PATH-------+
  |                   |
  |                   v
  |            Enter Email & Password
  |                   |
  |                   v
  |            Validate Credentials
  |                   |
  |                   +--> INVALID --> Show Error --> Loop Back
  |                   |
  |                   VALID --> Continue
  |                   |
  +--SIGNUP PATH------+
  |                   |
  |                   v
  |            Enter Email, Password, Name
  |                   |
  |                   v
  |            Email Already Exists?
  |                   |
  |                   +--> YES --> Show Error --> Loop Back
  |                   |
  |                   NO --> Continue
  |                   |
  |                   v
  |            Send Verification Email
  |                   |
  |                   v
  |            User Verifies Email
  |                   |
  |                   v
  +----> Create User Account in Database
           |
           v
        Generate JWT Token
           |
           v
        Store in Session/LocalStorage
           |
           v
        PROFILE SETUP
           |
           +--> User Enters Personal Details
           +--> User Selects Initial Allergies
           +--> Accepts Terms & Conditions
           |
           v
        Save Profile to Database
           |
           v
        Redirect to Dashboard
           |
           v
        END
```

## 8. CLASS DIAGRAM (UML)

```
┌─────────────────────────────────────────┐
│            User                         │
├─────────────────────────────────────────┤
│ - user_id: String                       │
│ - email: String                         │
│ - password_hash: String                 │
│ - first_name: String                    │
│ - last_name: String                     │
│ - date_created: DateTime                │
│ - last_login: DateTime                  │
├─────────────────────────────────────────┤
│ + register()                            │
│ + login()                               │
│ + updateProfile()                       │
│ + logout()                              │
│ + getPreferences()                      │
└─────────────────────────────────────────┘
         |                        |
         | 1                    1 |
         |----------HAS-----------| 
         |                        |
         v                        v
┌──────────────────────┐  ┌──────────────────────┐
│    Allergy           │  │   SavedRecipes       │
├──────────────────────┤  ├──────────────────────┤
│ - allergy_id: UUID   │  │ - saved_id: UUID     │
│ - user_id: FK        │  │ - user_id: FK        │
│ - allergen_name: Str │  │ - recipe_id: FK      │
│ - severity: Enum     │  │ - date_saved: DateTime│
│ - category: String   │  │ - notes: String      │
├──────────────────────┤  ├──────────────────────┤
│ + addAllergen()      │  │ + saveRecipe()       │
│ + removeAllergen()   │  │ + unsaveRecipe()     │
│ + getAllergens()     │  │ + getSavedRecipes()  │
└──────────────────────┘  └──────────────────────┘
         |                        |
         |                        | 1
         |                    0..* |
         |-------- USES -----------|
         |                        |
         |                        v
         |            ┌──────────────────────┐
         |            │    Recipe            │
         |            ├──────────────────────┤
         |            │ - recipe_id: UUID    │
         |            │ - title: String      │
         |            │ - ingredients: List  │
         |            │ - instructions: Text │
         |            │ - cooking_time: Int  │
         |            │ - difficulty: Enum   │
         |            │ - cuisine: String    │
         |            │ - nutrition: Object  │
         |            ├──────────────────────┤
         |            │ + getRecipe()        │
         |            │ + searchRecipes()    │
         |            │ + filterByAllergen() │
         |            │ + getRatings()       │
         |            └──────────────────────┘
         |                     |
         |                     | 0..*
         |          CHECKS AGAINST
         |                     |
         v                     v
    ALLERGEN MATCH     ┌──────────────────────┐
                       │  FoodItem            │
                       ├──────────────────────┤
                       │ - food_id: UUID      │
                       │ - name: String       │
                       │ - ingredients: List  │
                       │ - allergens: List    │
                       │ - manufacturer: Str  │
                       ├──────────────────────┤
                       │ + searchFood()       │
                       │ + getIngredients()   │
                       │ + checkSafety()      │
                       └──────────────────────┘


┌──────────────────────┐      ┌──────────────────────┐
│  Medicine            │      │  Recommendation      │
├──────────────────────┤      ├──────────────────────┤
│ - medicine_id: UUID  │      │ - rec_id: UUID       │
│ - name: String       │      │ - user_id: FK        │
│ - ingredients: List  │      │ - item_type: Enum    │
│ - interactions: List │      │ - item_id: FK        │
│ - contraindications: │      │ - reason: String     │
│   List               │      │ - score: Float       │
│ - dosage: String     │      │ - date_created: DT   │
├──────────────────────┤      ├──────────────────────┤
│ + searchMedicine()   │      │ + generateRecs()     │
│ + checkCompat()      │      │ + rankItems()        │
│ + getInteractions()  │      │ + saveUserFeedback() │
└──────────────────────┘      └──────────────────────┘
```

## 9. DATA FLOW DIAGRAM (Level 0)

```
                    ┌──────────────────┐
                    │                  │
                    │      USER        │
                    │                  │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │                 │
                    │  SAFEBITE       │
                    │  APPLICATION    │
                    │                 │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │                 │
                    │   DATABASE      │
                    │   (SUPABASE)    │
                    │                 │
                    └─────────────────┘

USER INTERACTIONS:
  - Input: Food Items, Medicines, Recipes, Allergies
  - Output: Safety Reports, Recommendations, Results

APP OPERATIONS:
  - Process queries
  - Validate data
  - Check allergies
  - Generate recommendations

DATABASE:
  - Store users, allergies, recipes, medicines
  - Maintain relationships
  - Support transactions
```

## 10. DATA FLOW DIAGRAM (Level 1)

```
┌────────────────┐
│     USER       │
└────────┬───────┘
         │
    ┌────┴─────────────────────────────────────────┐
    │                                              │
    v                                              v
┌──────────────────┐                   ┌──────────────────┐
│   INPUT MODULE   │                   │  OUTPUT MODULE   │
├──────────────────┤                   ├──────────────────┤
│ 1. Authenticate  │                   │ 1. Display       │
│ 2. Collect Data  │                   │    Results       │
│ 3. Validate      │                   │ 2. Show Reports  │
│    Input         │                   │ 3. Send Alerts   │
└────────┬─────────┘                   └────────▲─────────┘
         │                                      │
         v                                      │
┌──────────────────────────────────────────────┐│
│         PROCESSING MODULE                    ││
├──────────────────────────────────────────────┤│
│ 1. Parse Queries                             ││
│ 2. Cross-Reference Data                      ││
│ 3. Apply Business Rules                      ││
│ 4. Check Allergen Compatibility              ││
│ 5. Filter Results                            ││
│ 6. Rank Recommendations                      ││
└────────┬─�────────────────────────────────────┘│
         │ │                                    │
         │ └────────────────────────────────────┘
         │
         v
┌──────────────────────────────────────────┐
│      DATABASE INTERFACE MODULE           │
├──────────────────────────────────────────┤
│ 1. Query Builder                         │
│ 2. Data Retrieval                        │
│ 3. Data Storage                          │
│ 4. Cache Management                      │
└────────┬─────────────────────────────────┘
         │
         v
┌──────────────────────────────────────────┐
│    SUPABASE BACKEND                      │
├──────────────────────────────────────────┤
│ • Users Table                            │
│ • Allergies Table                        │
│ • Recipes Table                          │
│ • SavedRecipes Table                     │
│ • FoodItems Table                        │
│ • Medicines Table                        │
│ • Recommendations Table                  │
└──────────────────────────────────────────┘
```

## 11. ENTITY RELATIONSHIP DIAGRAM (ERD)

```
┌─────────────────────┐
│      USERS          │
├─────────────────────┤
│ PK: user_id        │
│ email              │
│ password_hash      │
│ first_name         │
│ last_name          │
│ created_at         │
│ updated_at         │
└─────────────────────┘
         │
         │ 1 : M
         │
    ┌────┴──────────────────┐
    │                       │
    v                       v
┌──────────────────┐  ┌──────────────────┐
│    ALLERGIES     │  │  SAVED_RECIPES   │
├──────────────────┤  ├──────────────────┤
│ PK: allergy_id   │  │ PK: saved_id     │
│ FK: user_id      │  │ FK: user_id      │
│ allergen_name    │  │ FK: recipe_id    │
│ severity         │  │ date_saved       │
│ category         │  │ notes            │
│ created_at       │  │ created_at       │
└──────────────────┘  └────────┬─────────┘
                               │
                               │ M : 1
                               │
                               v
                    ┌──────────────────────┐
                    │     RECIPES          │
                    ├──────────────────────┤
                    │ PK: recipe_id        │
                    │ title                │
                    │ ingredients (JSON)   │
                    │ instructions         │
                    │ cooking_time         │
                    │ difficulty           │
                    │ cuisine              │
                    │ nutrition (JSON)     │
                    │ rating               │
                    │ created_at           │
                    └──────────────────────┘
                               │
                               │ 1 : M
                               │
                               v
                    ┌──────────────────────┐
                    │  RECOMMENDATIONS     │
                    ├──────────────────────┤
                    │ PK: rec_id           │
                    │ FK: user_id          │
                    │ FK: recipe_id        │
                    │ reason               │
                    │ score                │
                    │ created_at           │
                    └──────────────────────┘


┌─────────────────────┐
│    FOOD_ITEMS       │
├─────────────────────┤
│ PK: food_id         │
│ name                │
│ ingredients (JSON)  │
│ allergens (JSON)    │
│ manufacturer        │
│ barcode             │
│ created_at          │
└─────────────────────┘


┌─────────────────────┐
│    MEDICINES        │
├─────────────────────┤
│ PK: medicine_id     │
│ name                │
│ ingredients (JSON)  │
│ interactions (JSON) │
│ dosage              │
│ created_at          │
└─────────────────────┘
```

## 12. COMPONENT DIAGRAM

```
┌────────────────────────────────────────────────────────┐
│                    React Application                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │         Pages/Views                           │   │
│  ├────────────────────────────────────────────────┤   │
│  │ • LandingPage                                  │   │
│  │ • Dashboard                                   │   │
│  │ • Allergies                                   │   │
│  │ • FoodSafety                                  │   │
│  │ • MedicineChecker                             │   │
│  │ • Recipes                                     │   │
│  │ • SavedRecipes                                │   │
│  │ • RecommendedRecipes                          │   │
│  │ • MealsPlanning                               │   │
│  │ • Settings                                    │   │
│  │ • CombinedAuth                                │   │
│  └────────────────────────────────────────────────┘   │
│            |          |          |                     │
│            v          v          v                     │
│  ┌────────────────────────────────────────────────┐   │
│  │      Reusable Components                       │   │
│  ├────────────────────────────────────────────────┤   │
│  │ • ProtectedRoute                               │   │
│  │ • Navigation/Header                            │   │
│  │ • Footer                                       │   │
│  │ • Card Components                              │   │
│  │ • Forms                                        │   │
│  │ • Modal Dialogs                                │   │
│  │ • Alerts/Notifications                         │   │
│  └────────────────────────────────────────────────┘   │
│                     |                                  │
│                     v                                  │
│  ┌────────────────────────────────────────────────┐   │
│  │       Services (API Layer)                     │   │
│  ├────────────────────────────────────────────────┤   │
│  │ • allergyService                               │   │
│  │ • foodSafetyService                            │   │
│  │ • medicineService                              │   │
│  │ • mealService                                  │   │
│  │ • savedRecipesService                          │   │
│  │ • recommendedRecipesService                    │   │
│  │ • allergenEngine                               │   │
│  │ • profileService                               │   │
│  │ • relatedProductsService                       │   │
│  │ • openFoodService                              │   │
│  └────────────────────────────────────────────────┘   │
│                     |                                  │
│                     v                                  │
│  ┌────────────────────────────────────────────────┐   │
│  │      Context API (State Management)            │   │
│  ├────────────────────────────────────────────────┤   │
│  │ • AuthContext                                  │   │
│  │ • ThemeContext                                 │   │
│  └────────────────────────────────────────────────┘   │
│                     |                                  │
│                     v                                  │
│  ┌────────────────────────────────────────────────┐   │
│  │      External Services                         │   │
│  ├────────────────────────────────────────────────┤   │
│  │ • Supabase (Auth + Database)                   │   │
│  │ • OpenFoodFacts API                            │   │
│  │ • Third-party Recipe APIs                      │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 13. SEQUENCE DIAGRAM: Food Safety Check

```
User              Frontend           Service            Database
 │                 │                 │                   │
 ├─ Search Food ──>│                 │                   │
 │                 │               │
 │                 ├─ Validate ────>│ Check Format      │
 │                 │<─ Valid ────────┤                   │
 │                 │                 │                   │
 │                 ├─ Query Food ───────────────────────>│
 │                 │                 │                   │
 │                 │                 │<─ Food Data ──────┤
 │                 │<─ Return ───────┤                   │
 │                 │                 │                   │
 │                 ├─ Get User ─────────────────────────>│
 │                 │    Allergies    │                   │
 │                 │                 │<─ Allergies ──────┤
 │                 │<─ Return ───────┤                   │
 │                 │                 │                   │
 │                 ├─ Compare ──────>│ Allergen Match    │
 │                 │    Ingredients  │                   │
 │                 │<─ Results ──────┤                   │
 │                 │                 │                   │
 │<─ Show Report ──┤                 │                   │
 │                 │                 │                   │
```

## 14. USE CASE DIAGRAM

```
                        ┌─────────────┐
                        │ SafeBite    │
                        │ System      │
                        └─────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                                 │
              v                                 v
        ┌──────────┐                    ┌──────────────┐
        │User      │                    │Admin/System  │
        │(Actor)   │                    │              │
        └─────┬────┘                    └──────────────┘
              │
    ┌─────────┼─────────┬─────────────┬──────────────┐
    │         │         │             │              │
    v         v         v             v              v
┌────────┐┌────────┐┌────────┐┌────────────┐┌──────────────┐
│Register││ Manage ││ Check  ││ Discover  ││   View       │
│ Login  ││Allergies││ Food  ││  Recipes  ││Recommendations
│ Logout ││        ││Safety ││           ││              │
└────────┘└────────┘└────────┘└────────────┘└──────────────┘
                          │
                          ├─ Search Product
                          ├─ Analyze Ingredients
                          ├─ Display Safety Status
                          ├─ Show Allergen Warnings
                          └─ Log Search History

                ┌──────────────┐
                │ Check        │
                │ Medicine     │
                │ Compatibility
                └──────────────┘
                          │
                          ├─ Search Medicine
                          ├─ Extract Components
                          ├─ Check Interactions
                          ├─ Verify Safety
                          └─ Display Report

                ┌──────────────┐
                │ Save/Share   │
                │ Content      │
                └──────────────┘
```

---

## How to Use These Diagrams:

1. **Copy the relevant diagram code** from each section
2. **For Mermaid diagrams**: Paste into [Mermaid Live Editor](https://mermaid.live)
3. **For ASCII diagrams**: Render directly or convert to PNG/JPG
4. **For LaTeX documentation**: Include generated images in your report
5. **For presentations**: Export as high-quality images (PNG/PDF)

Each diagram section can be converted to professional visual format using appropriate tools.
