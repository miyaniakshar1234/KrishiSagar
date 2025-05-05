# KrishiSagar System Design

## Table of Contents
1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [UML Diagrams](#uml-diagrams)
   - [3.1 Use Case Diagram](#31-use-case-diagram)
   - [3.2 Class Diagram](#32-class-diagram)
   - [3.3 Interaction Diagram](#33-interaction-diagram)
   - [3.4 Activity Diagram](#34-activity-diagram)

## Introduction

KrishiSagar (कृषि सागर) is a comprehensive agricultural ecosystem designed to connect and empower various stakeholders in India's agricultural landscape. The platform leverages modern technologies including AI, IoT, blockchain, and social collaboration to help farmers make data-driven decisions, receive real-time support, and participate in an efficient marketplace.

## System Overview

The KrishiSagar platform serves multiple user types:
- Farmers
- Agricultural Experts
- Store Owners (Agro-input suppliers)
- Market Brokers
- Consumers
- Students

The system provides specialized functionality for each user type while enabling cross-stakeholder interactions to create a holistic agricultural ecosystem.

## UML Diagrams

### 3.1 Use Case Diagram

```
                                 +---------------------------+
                                 |      KrishiSagar System   |
                                 +---------------------------+
                                             |
         +-----------------------------------------------------------+
         |                      |                |                    |
 +---------------+    +------------------+    +-----+     +---------------------+
 |    Farmer     |    |   Expert         |    |Store|     |  Market Broker     |
 +---------------+    +------------------+    |Owner|     +---------------------+
 | - Register    |    | - Register       |    +-----+     | - Register          |
 | - Login       |    | - Login          |    | - Register| - Login             |
 | - View Profile|    | - View Profile   |    | - Login   | - View Profile      |
 | - Edit Profile|    | - Edit Profile   |    | - View    | - Edit Profile      |
 | - Upload Crop |    | - Analyze Crop   |    |   Profile | - Manage Sales      |
 |   Images      |    |   Analysis       |    | - Edit    | - Record Transactions|
 | - View Analysis    | - Provide Expert |    |   Profile | - Generate Reports  |
 | - Track Soil  |    |   Advice         |    | - Manage  | - View Market Trends|
 |   Health      |    | - Participate    |    |   Inventory                     |
 | - Post in     |    |   in KrishiGram  |    | - List    +---------------------+
 |   KrishiGram  |    | - Educational    |    |   Products|
 | - Follow      |    |   Content        |    | - Update  |    +-------------+
 |   Others      |    +------------------+    |   Prices  |    |  Consumer   |
 | - Join Groups |                            | - View    |    +-------------+
 | - View Market |                            |   Analytics    | - Register   |
 |   Prices      |                            +-----+     | - Login      |
 | - View Weather|                                  |     | - View Profile|
 |   Forecasts   |                                  |     | - Edit Profile|
 | - Plan Crop   |                                  |     | - Browse Farm |
 |   Rotations   |                                  |     |   Products    |
 +---------------+                                  |     | - Purchase    |
         |                                          |     |   Products    |
         |                                          |     | - Track Orders|
         v                                          v     +-------------+
 +------------------+                      +----------------+
 |   Soil Health    |                      |  Marketplace   |
 +------------------+                      +----------------+
 | - Submit Samples |                      | - List Products|
 | - View Reports   |                      | - Buy Products |
 | - Track History  |                      | - Sell Produce |
 | - Get            |                      | - View Prices  |
 |   Recommendations|                      | - Transactions |
 +------------------+                      +----------------+
```

### 3.2 Class Diagram

```
+------------------+       +-------------------+        +-------------------+
|      User        |       |     Profile       |        |  UserRole         |
+------------------+       +-------------------+        +-------------------+
| id: UUID         |<>---->| id: UUID          |        | id: UUID          |
| email: String    |       | user_id: UUID     |        | user_id: UUID     |
| full_name: String|       | created_at: Date  |        | role_type: String |
| phone: String    |       | updated_at: Date  |        | is_primary: Bool  |
| user_type: String|       +-------------------+        | created_at: Date  |
| created_at: Date |                ^                   | updated_at: Date  |
| updated_at: Date |                |                   +-------------------+
+------------------+                |
                                    |
        +----------------------------------------------------+
        |                           |                        |
+-------------------+    +--------------------+     +------------------+
| FarmerProfile     |    | StoreOwnerProfile  |     | BrokerProfile    |
+-------------------+    +--------------------+     +------------------+
| id: UUID          |    | id: UUID           |     | id: UUID         |
| user_id: UUID     |    | user_id: UUID      |     | user_id: UUID    |
| farm_location: Str|    | store_name: String |     | market_name: Str |
| land_area: Numeric|    | store_location: Str|     | license_number:  |
| crops_grown: Arr  |    | gst_number: String |     | specializations: |
| farming_practices |    | specializations:   |     | created_at: Date |
| created_at: Date  |    | created_at: Date   |     | updated_at: Date |
| updated_at: Date  |    | updated_at: Date   |     +------------------+
+-------------------+    +--------------------+              ^
        ^                         ^                          |
        |                         |                          |
+-------------------+    +--------------------+              |
| ExpertProfile     |    | ConsumerProfile    |              |
+-------------------+    +--------------------+              |
| id: UUID          |    | id: UUID           |     +------------------+
| user_id: UUID     |    | user_id: UUID      |     | MarketSale       |
| expertise: String |    | preferences: String|     +------------------+
| qualification: Str|    | interests: String[]|     | id: UUID         |
| years_experience: |    | created_at: Date   |     | sale_number: Str |
| created_at: Date  |    | updated_at: Date   |<--->| farmer_id: UUID  |
| updated_at: Date  |    +--------------------+     | broker_id: UUID  |
+-------------------+              ^                | crop_type: String|
        ^                          |                | quantity: Numeric|
        |                          |                | rate_per_unit: N |
+-------------------+    +--------------------+     | total_amount: N  |
| StudentProfile    |    | KrishigramPost     |     | commission: N    |
+-------------------+    +--------------------+     | net_amount: N    |
| id: UUID          |    | id: UUID           |     | market_name: Str |
| user_id: UUID     |    | user_id: UUID      |     | payment_method:  |
| institution: Str  |    | content: Text      |     | payment_status:  |
| field_of_study: St|    | media_url: String  |     | created_at: Date |
| graduation_year:  |    | media_type: String |     | updated_at: Date |
| created_at: Date  |    | location: String   |     +------------------+
| updated_at: Date  |    | type: String       |              |
+-------------------+    | tags: String[]     |              |
                         | created_at: Date   |              v
                         | updated_at: Date   |     +------------------+
                         +--------------------+     | SaleItem         |
                                  |                 +------------------+
                                  |                 | id: UUID         |
                        +---------+--------+        | sale_id: UUID    |
                        |                  |        | crop_name: String|
              +--------------------+  +------------+| quantity: Numeric|
              | KrishigramComment  |  | KrishiLike || unit: String    |
              +--------------------+  +------------+| price_per_unit: N|
              | id: UUID           |  | id: UUID   || total_amount: N  |
              | post_id: UUID      |  | post_id: ID|| grade: String    |
              | user_id: UUID      |  | comment_id:|| created_at: Date |
              | content: Text      |  | user_id: ID|+------------------+
              | created_at: Date   |  | created_at:|
              | updated_at: Date   |  +------------+
              +--------------------+

+-------------------+    +--------------------+     +------------------+
| SoilTest          |    | CropAnalysis       |     | CropRotationPlan |
+-------------------+    +--------------------+     +------------------+
| id: UUID          |    | id: UUID           |     | id: UUID         |
| user_id: UUID     |    | user_id: UUID      |     | user_id: UUID    |
| date: Date        |    | image_path: String |     | name: String     |
| location: String  |    | health_status: Str |     | location: String |
| ph: Numeric       |    | disease_detected:  |     | start_date: Date |
| nitrogen: Integer |    | confidence: Numeric|     | created_at: Date |
| phosphorus: Int   |    | recommendations:   |     | updated_at: Date |
| potassium: Integer|    | nutrient_status:   |     +------------------+
| organic_matter: N |    | created_at: Date   |              |
| moisture: Integer |    | updated_at: Date   |              v
| notes: Text       |    +--------------------+     +------------------+
| created_at: Date  |                               | CropCycle        |
| updated_at: Date  |                               +------------------+
+-------------------+                               | id: UUID         |
                                                    | plan_id: UUID    |
                                                    | season_name: Str |
                                                    | crop_family: Str |
                                                    | crop_name: String|
                                                    | start_date: Date |
                                                    | end_date: Date   |
                                                    | notes: Text      |
                                                    | created_at: Date |
                                                    | updated_at: Date |
                                                    +------------------+
```

### 3.3 Interaction Diagram

#### Sequence Diagram: Crop Analysis Flow

```
+--------+    +-------------+    +---------------+    +----------------+    +------------+
| Farmer |    | KrishiSagar |    | AI Analysis   |    | Expert         |    | Notification|
|        |    | Frontend    |    | Service       |    |                |    | Service     |
+--------+    +-------------+    +---------------+    +----------------+    +------------+
    |                |                  |                    |                    |
    | Upload Image   |                  |                    |                    |
    |--------------->|                  |                    |                    |
    |                | Process Image    |                    |                    |
    |                |----------------->|                    |                    |
    |                |                  |                    |                    |
    |                |                  | Analyze Crop       |                    |
    |                |                  |------              |                    |
    |                |                  |     |              |                    |
    |                |                  |<-----              |                    |
    |                |                  |                    |                    |
    |                |                  | Store Results      |                    |
    |                |                  |------              |                    |
    |                |                  |     |              |                    |
    |                |                  |<-----              |                    |
    |                |                  |                    |                    |
    |                |                  | Return Analysis    |                    |
    |                |<-----------------|                    |                    |
    |                |                  |                    |                    |
    |                | Display Results  |                    |                    |
    |<---------------|                  |                    |                    |
    |                |                  |                    |                    |
    |                |                  | If Disease Detected|                    |
    |                |                  |-------------------->                    |
    |                |                  |                    |                    |
    |                |                  |                    | Review Analysis    |
    |                |                  |                    |--------            |
    |                |                  |                    |       |            |
    |                |                  |                    |<-------            |
    |                |                  |                    |                    |
    |                |                  |                    | Expert Advice      |
    |                |<--------------------------------------|                    |
    |                |                  |                    |                    |
    |                |                  |                    | Send Notification  |
    |                |                  |                    |------------------->|
    |                |                  |                    |                    |
    |                |                  |                    |                    | Send Alert
    |<------------------------------------------------------------------------------|
    |                |                  |                    |                    |
```

#### Sequence Diagram: Market Transaction Flow

```
+--------+    +--------+    +-------------+    +----------------+    +------------+
| Farmer |    | Broker |    | KrishiSagar |    | Payment        |    | Farmer     |
|        |    |        |    | Backend     |    | Service        |    | Dashboard  |
+--------+    +--------+    +-------------+    +----------------+    +------------+
    |             |                |                   |                   |
    | Bring Crops |                |                   |                   |
    |------------>|                |                   |                   |
    |             |                |                   |                   |
    |             | Record Sale    |                   |                   |
    |             |--------------->|                   |                   |
    |             |                |                   |                   |
    |             |                | Save Transaction  |                   |
    |             |                |-------            |                   |
    |             |                |      |            |                   |
    |             |                |<------            |                   |
    |             |                |                   |                   |
    |             |                | Process Payment   |                   |
    |             |                |------------------>|                   |
    |             |                |                   |                   |
    |             |                |                   | Complete Payment  |
    |             |                |                   |-------            |
    |             |                |                   |      |            |
    |             |                |                   |<------            |
    |             |                |                   |                   |
    |             |                | Payment Confirmation                  |
    |             |                |<------------------|                   |
    |             |                |                   |                   |
    |             | Sale Confirmed |                   |                   |
    |             |<---------------|                   |                   |
    |             |                |                   |                   |
    |             | Give Receipt   |                   |                   |
    |<------------|                |                   |                   |
    |             |                |                   |                   |
    |             |                | Update Farmer Dashboard               |
    |             |                |-------------------------------------->|
    |             |                |                   |                   |
    |             |                |                   |                   |
    | View Sales History           |                   |                   |
    |------------------------------------------------->|                   |
    |             |                |                   |                   |
    | Show Sales Data              |                   |                   |
    |<-------------------------------------------------|                   |
    |             |                |                   |                   |
```

### 3.4 Activity Diagram

#### Soil Health Management Flow

```
                          ┌──────────────────┐
                          │     Start        │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │  Farmer collects │
                          │   soil sample    │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │ Upload soil test │
                          │  information     │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │   System stores  │
                          │    soil data     │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │  AI analysis of  │
                          │    soil health   │
                          └────────┬─────────┘
                                   │
              ┌───────────────────┐│┌───────────────────┐
              │                   ││                    │
     ┌────────▼─────────┐  ┌──────▼▼─────────┐  ┌──────▼───────────┐
     │ Generate health  │  │ Generate crop   │  │ Generate         │
     │    report        │  │recommendations  │  │ fertilizer plan  │
     └────────┬─────────┘  └──────┬─────────┘  └──────┬───────────┘
              │                   │                    │
              └───────────────────┼────────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │ Send notification │
                         │    to farmer      │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Farmer views    │
                         │   soil report    │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │ Farmer applies   │
                         │ recommendations  │
                         └────────┬─────────┘
                                  │
                                  │
                         ┌────────▼─────────┐
                         │ Farmer tracks    │
                         │ soil improvement │
                         └────────┬─────────┘
                                  │
                                  │
                         ┌────────▼─────────┐
                         │      End         │
                         └──────────────────┘
```

#### KrishiGram Social Interaction Flow

```
                          ┌──────────────────┐
                          │       Start      │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │    User login    │
                          └────────┬─────────┘
                                   │
              ┌───────────────────┐│┌───────────────────┐
              │                   ││                    │
     ┌────────▼─────────┐  ┌──────▼▼─────────┐  ┌──────▼───────────┐
     │   Create post    │  │  Browse feed    │  │   Join groups    │
     └────────┬─────────┘  └──────┬─────────┘  └──────┬───────────┘
              │                   │                    │
     ┌────────▼─────────┐         │            ┌──────▼───────────┐
     │ Add text, image  │         │            │ Participate in   │
     │    or video      │         │            │ group discussions│
     └────────┬─────────┘         │            └──────┬───────────┘
              │                   │                    │
     ┌────────▼─────────┐         │                    │
     │    Add location  │         │                    │
     │      & tags      │         │                    │
     └────────┬─────────┘         │                    │
              │                   │                    │
     ┌────────▼─────────┐  ┌──────▼─────────┐          │
     │   Publish post   │  │  View posts    │          │
     └────────┬─────────┘  └──────┬─────────┘          │
              │                   │                    │
              │            ┌──────▼─────────┐          │
              │            │ Like, comment  │          │
              │            │   or share     │          │
              │            └──────┬─────────┘          │
              │                   │                    │
              └───────────────────┼────────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Receive         │
                         │  notifications   │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │      End         │
                         └──────────────────┘
``` 