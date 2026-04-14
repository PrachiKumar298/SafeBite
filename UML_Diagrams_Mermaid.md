# SafeBite UML - Mermaid Diagrams

## 1. Main System Flowchart (Mermaid)

```mermaid
flowchart TD
    A[User Visits SafeBite] --> B{Authenticated?}
    B -->|Yes| C[Redirect to Dashboard]
    B -->|No| D[Display Landing Page]
    
    D --> E{User Choice}
    E -->|SignUp| F[Registration Form]
    E -->|Login| G[Login Form]
    
    F --> H[Enter Credentials & Details]
    G --> I[Enter Email & Password]
    
    H --> J[Set Initial Allergies]
    I --> J
    
    J --> C
    
    C --> K[Dashboard]
    K --> L{Select Module}
    
    L -->|Allergies| M[Manage Allergies]
    L -->|Food Safety| N[Check Food Safety]
    L -->|Medicine| O[Check Medicine]
    L -->|Recipes| P[Browse Recipes]
    L -->|Recommendations| Q[View Recommendations]
    L -->|Profile| R[Edit Profile]
    
    M --> S{Continue?}
    N --> S
    O --> S
    P --> S
    Q --> S
    R --> S
    
    S -->|Yes| K
    S -->|No| T[Logout]
    T --> U[End Session]
```

## 2. Allergy Management Flow

```mermaid
flowchart TD
    A[Open Allergies Module] --> B[Display Current Allergies]
    B --> C[User Selects/Deselects Allergens]
    C --> D{Input Valid?}
    D -->|No| E[Show Error Message]
    E --> C
    D -->|Yes| F[Validate Data]
    F --> G[Save to Database]
    G --> H[Update Recommendation Engine]
    H --> I[Update Cache]
    I --> J[Show Success Message]
    J --> K{Continue?}
    K -->|Yes| A
    K -->|No| L[Return to Dashboard]
```

## 3. Food Safety Checker Flow

```mermaid
flowchart TD
    A[User Enters Food/Product] --> B{Product Found?}
    B -->|No| C[Show Not Found Message]
    B -->|Yes| D[Retrieve Product Data]
    D --> E[Extract Ingredients]
    E --> F[Load User Allergies]
    F --> G{Allergen Match?}
    G -->|Yes| H[Generate Warning Report]
    G -->|No| I[Generate Safe Report]
    H --> J[Display Result with Warnings]
    I --> J
    J --> K{User Action?}
    K -->|Save| L[Save to History]
    K -->|Share| M[Generate Share Link]
    K -->|Continue| N[New Search]
    L --> O[Back to Dashboard]
    M --> O
    N --> A
```

## 4. Medicine Checker Flow

```mermaid
flowchart TD
    A[User Searches Medicine] --> B{Medicine Found?}
    B -->|No| C[Show Not Found]
    B -->|Yes| D[Extract Medicine Data]
    D --> E[Get Ingredients & Properties]
    E --> F[Load User Allergies]
    F --> G[Check Compatibility]
    G --> H{Compatible?}
    H -->|No| I[Show Alert Report]
    H -->|Yes| J[Confirm Safety]
    I --> K[Display Full Report]
    J --> K
    K --> L{User Action?}
    L -->|Save| M[Save Report]
    L -->|Share| N[Share with Doctor]
    L -->|Continue| O[New Search]
    M --> P[Return to Dashboard]
    N --> P
    O --> A
```

## 5. Recipe Discovery Flow

```mermaid
flowchart TD
    A[Access Recipe Module] --> B[Display Filter Options]
    B --> C[User Applies Filters]
    C --> D[Query Recipe Database]
    D --> E[Apply Allergen Filters]
    E --> F[Generate Safe Recipe List]
    F --> G[Display Recipes]
    G --> H[User Selects Recipe]
    H --> I[Load Recipe Details]
    I --> J{User Action?}
    J -->|Save| K[Add to Saved Recipes]
    J -->|View Details| L[Show Full Info]
    J -->|Next| G
    K --> M[Return to List]
    L --> M
    M --> N{Continue?}
    N -->|Yes| G
    N -->|No| O[Return to Dashboard]
```

## 6. Recommendation Engine Flow

```mermaid
flowchart TD
    A[Trigger Recommendations] --> B[Collect User Data]
    B --> C[Get Allergies Profile]
    C --> D[Fetch Recipe History]
    D --> E[Query Recipe Database]
    E --> F[Apply Safety Filters]
    F --> G[Remove Allergen Items]
    G --> H[Rank by Relevance]
    H --> I[Generate Recommendation List]
    I --> J[Check Diversity]
    J --> K[Personalize Results]
    K --> L[Display to User]
    L --> M{User Interaction?}
    M -->|Like| N[Update Preferences]
    M -->|Save| O[Add to Saved]
    M -->|Dislike| P[Mark Not Interested]
    N --> Q[Update Model]
    O --> Q
    P --> Q
    Q --> R[Return to Dashboard]
```

## 7. User Authentication Flow

```mermaid
flowchart TD
    A[Check Session/Token] --> B{Token Valid?}
    B -->|Yes| C[Skip to Dashboard]
    B -->|No/Expired| D[Display Login/SignUp]
    D --> E{User Choice?}
    E -->|Login| F[Enter Email & Password]
    E -->|SignUp| G[Enter Details]
    F --> H[Validate Credentials]
    H --> I{Valid?}
    I -->|No| J[Show Error]
    J --> F
    I -->|Yes| K[Create JWT Token]
    G --> L[Check Email Exists]
    L --> M{Exists?}
    M -->|Yes| N[Show Error]
    N --> G
    M -->|No| O[Send Verification Email]
    O --> P[User Verifies]
    P --> Q[Create Account]
    Q --> R[User Setup Profile]
    R --> S[Select Initial Allergies]
    S --> K
    K --> T[Store Token]
    T --> C
    C --> U[Redirect to Dashboard]
```

## 8. Class Diagram

```mermaid
classDiagram
    class User {
        -user_id: String
        -email: String
        -password_hash: String
        -first_name: String
        -last_name: String
        -date_created: DateTime
        -last_login: DateTime
        +register()
        +login()
        +updateProfile()
        +logout()
        +getPreferences()
    }
    
    class Allergy {
        -allergy_id: String
        -user_id: String
        -allergen_name: String
        -severity: Enum
        -category: String
        +addAllergen()
        +removeAllergen()
        +getAllergens()
    }
    
    class Recipe {
        -recipe_id: String
        -title: String
        -ingredients: List
        -instructions: Text
        -cooking_time: Integer
        -difficulty: Enum
        -cuisine: String
        -nutrition: Object
        +getRecipe()
        +searchRecipes()
        +filterByAllergen()
        +getRatings()
    }
    
    class SavedRecipes {
        -saved_id: String
        -user_id: String
        -recipe_id: String
        -date_saved: DateTime
        -notes: String
        +saveRecipe()
        +unsaveRecipe()
        +getSavedRecipes()
    }
    
    class FoodItem {
        -food_id: String
        -name: String
        -ingredients: List
        -allergens: List
        -manufacturer: String
        +searchFood()
        +getIngredients()
        +checkSafety()
    }
    
    class Medicine {
        -medicine_id: String
        -name: String
        -ingredients: List
        -interactions: List
        -dosage: String
        +searchMedicine()
        +checkCompatibility()
        +getInteractions()
    }
    
    class Recommendation {
        -rec_id: String
        -user_id: String
        -item_id: String
        -reason: String
        -score: Float
        +generateRecommendations()
        +rankItems()
        +saveFeedback()
    }
    
    User "1" --> "*" Allergy
    User "1" --> "*" SavedRecipes
    User "1" --> "*" Recommendation
    SavedRecipes "M" --> "1" Recipe
    Recipe "1" --> "*" Recommendation
    Allergy --> FoodItem: checks
    Allergy --> Medicine: checks
    Recommendation --> Recipe: references
    Recommendation --> FoodItem: references
```

## 9. Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ ALLERGIES : has
    USER ||--o{ SAVED_RECIPES : saves
    USER ||--o{ RECOMMENDATIONS : receives
    RECIPES ||--o{ SAVED_RECIPES : "is saved in"
    RECIPES ||--o{ RECOMMENDATIONS : "is recommended"
    USER {
        string user_id PK
        string email
        string password_hash
        string first_name
        string last_name
        datetime created_at
        datetime updated_at
    }
    ALLERGIES {
        string allergy_id PK
        string user_id FK
        string allergen_name
        string severity
        string category
        datetime created_at
    }
    RECIPES {
        string recipe_id PK
        string title
        json ingredients
        text instructions
        integer cooking_time
        string difficulty
        string cuisine
        json nutrition
        float rating
        datetime created_at
    }
    SAVED_RECIPES {
        string saved_id PK
        string user_id FK
        string recipe_id FK
        datetime date_saved
        text notes
        datetime created_at
    }
    FOOD_ITEMS {
        string food_id PK
        string name
        json ingredients
        json allergens
        string manufacturer
        string barcode
        datetime created_at
    }
    MEDICINES {
        string medicine_id PK
        string name
        json ingredients
        json interactions
        string dosage
        datetime created_at
    }
    RECOMMENDATIONS {
        string rec_id PK
        string user_id FK
        string item_id FK
        string item_type
        string reason
        float score
        datetime created_at
    }
```

## 10. State Diagram - User Session

```mermaid
stateDiagram-v2
    [*] --> Landing
    Landing --> SignUp: Create Account
    Landing --> Login: Enter Credentials
    SignUp --> Verify: Send Email
    Verify --> Profile: Confirm Email
    Login --> Dashboard: Credentials Valid
    Profile --> Dashboard: Setup Complete
    Dashboard --> Allergies: Click Allergies
    Dashboard --> FoodSafety: Click Food Safety
    Dashboard --> MedicineCheck: Click Medicines
    Dashboard --> Recipes: Click Recipes
    Dashboard --> Recommendations: Click Recommendations
    Dashboard --> Settings: Click Settings
    Allergies --> Dashboard: Done
    FoodSafety --> Dashboard: Done
    MedicineCheck --> Dashboard: Done
    Recipes --> Dashboard: Done
    Recommendations --> Dashboard: Done
    Settings --> Dashboard: Done
    Dashboard --> Logout: Click Logout
    Logout --> [*]
```

## 11. Sequence Diagram - Complete Food Safety Check

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Service
    participant Database
    participant Supabase
    
    User->>Frontend: Enter Food Name
    Frontend->>Service: Validate Input
    Service-->>Frontend: Valid
    Frontend->>Service: Search Food
    Service->>Database: Query Food Data
    Database-->>Service: Food Record
    Service->>Supabase: Get User Allergies
    Supabase-->>Service: Allergy Data
    Service->>Service: Compare Ingredients
    alt Allergen Found
        Service->>Service: Generate Warning
        Service-->>Frontend: Warning Report
    else Safe
        Service->>Service: Generate Safe Report
        Service-->>Frontend: Safe Report
    end
    Frontend->>Database: Log Search
    Frontend-->>User: Display Result
```

## 12. Deployment Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer"]
        WEB[Web Browser]
        RESPONSIVE[Responsive UI<br/>React 18]
    end
    
    subgraph Frontend["Frontend"]
        VITE[Vite Dev Server<br/>Build Tool]
        REACT[React Components<br/>React Router]
        TAILWIND[Tailwind CSS<br/>Styling]
    end
    
    subgraph Services["Service Layer"]
        ALLERGEN[Allergen Engine]
        ALLERGY[Allergy Service]
        FOOD[Food Safety Service]
        MEDICINE[Medicine Service]
        RECIPE[Recipe Service]
        RECOMMEND[Recommendation Service]
    end
    
    subgraph Backend["Backend & Database"]
        SUPABASE[Supabase]
        AUTH[Authentication]
        DB[(PostgreSQL<br/>Database)]
        API[REST APIs]
    end
    
    subgraph External["External APIs"]
        OPENFOOD[OpenFoodFacts API]
        RECIPES_API[Recipe Database]
    end
    
    WEB --> RESPONSIVE
    RESPONSIVE --> REACT
    REACT --> VITE
    VITE --> TAILWIND
    
    RESPOND --> ALLERGEN
    REACT --> ALLERGY
    REACT --> FOOD
    REACT --> MEDICINE
    REACT --> RECIPE
    REACT --> RECOMMEND
    
    ALLERGEN --> API
    ALLERGY --> API
    FOOD --> API
    MEDICINE --> API
    RECIPE --> API
    RECOMMEND --> API
    
    API --> AUTH
    API --> DB
    AUTH --> SUPABASE
    DB --> SUPABASE
    
    API --> OPENFOOD
    API --> RECIPES_API
```

## How to Use These Mermaid Diagrams:

### Option 1: Mermaid Live Editor
- Go to [Mermaid Live Editor](https://mermaid.live)
- Copy any diagram code (starting with ```mermaid)
- Paste into the editor
- Export as PNG/SVG

### Option 2: GitHub Markdown
- Paste directly into .md files
- GitHub will automatically render them

### Option 3: VS Code with Mermaid Extension
- Install "Markdown Preview Mermaid Support"
- Preview .md files in VS Code
- Diagrams render automatically

### Option 4: Include in LaTeX Report
```latex
% In your LaTeX document
\begin{figure}[h!]
  \centering
  \includegraphics[width=0.9\textwidth]{safebite-flowchart.png}
  \caption{SafeBite Main System Flowchart}
\end{figure}
```

---

**Export Instructions:**
1. Open Mermaid Live Editor
2. Paste diagram code
3. Click "Download" 
4. Choose PNG or SVG format
5. Insert into LaTeX report
