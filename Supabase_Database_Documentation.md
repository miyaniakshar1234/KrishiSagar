# KrishiSagar Supabase Database Documentation

### Public Schema Tables

#### 1. users

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | null | Primary key |
| email | text | false | null | User email (unique) |
| full_name | text | true | null | User's full name |
| phone | text | true | null | User's phone number |
| user_type | text | true | null | Type of user (farmer, expert, etc.) |
| language_preference | text | true | 'en' | User's preferred language |
| created_at | timestamptz | false | now() | Record creation timestamp |
| updated_at | timestamptz | false | now() | Record update timestamp |

RLS Enabled: true

#### 2. user_roles

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| email | text | false | null | User email |
| user_id | uuid | true | null | Foreign key to users.id |
| role_type | text | false | null | Type of role |
| is_primary | boolean | true | false | Indicates if this is the primary role |
| created_at | timestamptz | false | now() | Record creation timestamp |
| updated_at | timestamptz | false | now() | Record update timestamp |

RLS Enabled: true

#### 3. farmer_profiles

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| user_id | uuid | true | null | Foreign key to users.id (unique) |
| farm_location | text | true | null | Location of farm |
| land_area | numeric | true | null | Area of land |
| crops_grown | text[] | true | null | Array of crops grown |
| farming_practices | text[] | true | null | Array of farming practices |
| created_at | timestamptz | false | now() | Record creation timestamp |
| updated_at | timestamptz | false | now() | Record update timestamp |

RLS Enabled: true

#### 4. store_owner_profiles

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| user_id | uuid | true | null | Foreign key to users.id (unique) |
| store_name | text | false | 'My Agricultural Store' | Name of the store |
| store_location | text | true | null | Location of the store |
| gst_number | text | true | null | GST registration number |
| specializations | text[] | true | null | Array of store specializations |
| created_at | timestamptz | false | now() | Record creation timestamp |
| updated_at | timestamptz | false | now() | Record update timestamp |

RLS Enabled: true

#### 5. broker_profiles

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| user_id | uuid | true | null | Foreign key to users.id (unique) |
| market_name | text | true | null | Name of the market |
| license_number | text | true | null | Broker license number |
| specializations | text[] | true | null | Array of broker specializations |
| created_at | timestamptz | false | now() | Record creation timestamp |
| updated_at | timestamptz | false | now() | Record update timestamp |

RLS Enabled: true

#### 6. expert_profiles

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| user_id | uuid | true | null | Foreign key to users.id (unique) |
| expertise | text | true | null | Area of expertise |
| qualification | text | true | null | Professional qualifications |
| years_experience | integer | true | null | Years of experience |
| created_at | timestamptz | false | now() | Record creation timestamp |
| updated_at | timestamptz | false | now() | Record update timestamp |

RLS Enabled: true

#### 7. student_profiles

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| user_id | uuid | true | null | Foreign key to users.id (unique) |
| institution | text | true | null | Educational institution |
| field_of_study | text | true | null | Field of study |
| graduation_year | integer | true | null | Expected graduation year |
| created_at | timestamptz | false | now() | Record creation timestamp |
| updated_at | timestamptz | false | now() | Record update timestamp |

RLS Enabled: true

#### 8. consumer_profiles

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| user_id | uuid | true | null | Foreign key to users.id (unique) |
| preferences | text | true | null | Consumer preferences |
| interests | text[] | true | null | Array of interests |
| created_at | timestamptz | false | now() | Record creation timestamp |
| updated_at | timestamptz | false | now() | Record update timestamp |

RLS Enabled: true

#### 9. soil_tests

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| date | date | false | null | Test date |
| location | text | false | null | Test location |
| ph | numeric | false | null | Soil pH level |
| nitrogen | integer | false | null | Nitrogen content |
| phosphorus | integer | false | null | Phosphorus content |
| potassium | integer | false | null | Potassium content |
| organic_matter | numeric | false | null | Organic matter percentage |
| moisture | integer | false | null | Moisture content |
| notes | text | true | null | Additional notes |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |

RLS Enabled: true

#### 10. soil_recommendations

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| title | text | false | null | Recommendation title |
| description | text | false | null | Detailed description |
| crop_types | text[] | false | null | Array of applicable crop types |
| soil_condition | text | false | null | Soil condition |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |

RLS Enabled: true

#### 11. crop_analyses

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| image_path | text | false | null | Path to crop image |
| health_status | text | true | null | Health status assessment |
| disease_detected | text | true | null | Detected disease if any |
| confidence | numeric | true | null | Confidence level of analysis |
| recommendations | text[] | true | null | Array of recommendations |
| nutrient_status | jsonb | true | null | Nutrient status details |
| created_at | timestamptz | true | CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | timestamptz | true | CURRENT_TIMESTAMP | Record update timestamp |

RLS Enabled: true

#### 12. crop_analysis_history

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| image_url | text | false | null | URL to the analyzed image |
| crop_type | text | true | null | Type of crop |
| health_status | text | true | null | Health status assessment |
| disease_detected | text | true | null | Detected disease if any |
| confidence | numeric | true | null | Confidence level of analysis |
| pests | text[] | true | null | Array of detected pests |
| recommendations | text[] | true | null | Array of recommendations |
| nutrient_status | jsonb | true | null | Nutrient status details |
| raw_analysis | jsonb | true | null | Raw analysis data |
| created_at | timestamptz | true | now() | Record creation timestamp |

RLS Enabled: true

#### 13. farm_locations

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| name | text | false | null | Location name |
| coordinates | text | true | null | Geographic coordinates |
| area | numeric | true | null | Area size |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |

RLS Enabled: true

#### 14. crop_rotation_plans

Primary key: 

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| name | text | false | null | Plan name |
| location | text | false | null | Farm location |
| start_date | date | false | null | Start date of rotation plan |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |

RLS Enabled: true

#### 15. crop_cycles

Primary key:

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| plan_id | uuid | false | null | Foreign key to crop_rotation_plans.id |
| season_name | text | false | null | Name of season |
| crop_family | text | false | null | Crop family |
| crop_name | text | false | null | Specific crop name |
| start_date | date | false | null | Start date of cycle |
| end_date | date | false | null | End date of cycle |
| notes | text | true | null | Additional notes |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |

RLS Enabled: true

#### 16. krishigram_posts

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| content | text | false | null | Post content |
| media_url | text | true | null | URL to media content |
| media_type | text | true | null | Type of media (image/video) |
| location | text | true | null | Location of post |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |
| type | text | false | null | Post type (post/reel/story) |
| tags | text[] | true | null | Array of post tags |

RLS Enabled: true

#### 17. krishigram_comments

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| post_id | uuid | false | null | Foreign key to krishigram_posts.id |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| content | text | false | null | Comment content |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |

RLS Enabled: true

#### 18. krishigram_likes

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| post_id | uuid | true | null | Foreign key to krishigram_posts.id |
| comment_id | uuid | true | null | Foreign key to krishigram_comments.id |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| created_at | timestamptz | true | now() | Record creation timestamp |

RLS Enabled: true

#### 19. krishigram_groups

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| name | text | false | null | Group name |
| description | text | true | null | Group description |
| created_by | uuid | false | null | Foreign key to auth.users.id |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |
| cover_image_url | text | true | null | URL to cover image |
| members_count | integer | true | 0 | Count of members |
| is_private | boolean | true | false | Privacy setting |

RLS Enabled: true

#### 20. krishigram_group_members

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| group_id | uuid | false | null | Foreign key to krishigram_groups.id |
| user_id | uuid | false | null | Foreign key to auth.users.id |
| role | text | false | null | Role in group (member/moderator/admin) |
| joined_at | timestamptz | true | now() | Join timestamp |

RLS Enabled: true

#### 21. krishigram_group_posts

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| group_id | uuid | false | null | Foreign key to krishigram_groups.id |
| post_id | uuid | false | null | Foreign key to krishigram_posts.id |
| created_at | timestamptz | true | now() | Record creation timestamp |

RLS Enabled: true

#### 22. krishigram_followers

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| follower_id | uuid | false | null | Foreign key to auth.users.id |
| following_id | uuid | false | null | Foreign key to auth.users.id |
| created_at | timestamptz | true | now() | Record creation timestamp |

RLS Enabled: true

#### 23. market_sales

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| sale_number | text | false | null | Unique sale identifier |
| sale_date | date | false | CURRENT_DATE | Date of sale |
| farmer_id | uuid | true | null | Foreign key to auth.users.id |
| farmer_name | text | false | null | Name of farmer |
| farmer_mobile | text | true | null | Farmer's mobile number |
| crop_type | text | false | null | Type of crop sold |
| quantity | numeric | false | null | Quantity sold |
| unit | text | false | 'kg' | Unit of measurement |
| rate_per_unit | numeric | false | null | Price per unit |
| total_amount | numeric | false | null | Total sale amount |
| commission_percentage | numeric | false | 2.5 | Commission percentage |
| commission_amount | numeric | false | null | Commission amount |
| net_amount | numeric | false | null | Net amount after commission |
| market_name | text | false | null | Name of market |
| payment_method | text | false | 'cash' | Method of payment |
| payment_status | text | false | 'completed' | Status of payment |
| notes | text | true | null | Additional notes |
| broker_id | uuid | false | null | Foreign key to auth.users.id |
| is_canceled | boolean | true | false | Cancellation status |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |
| transaction_number | text | true | null | Transaction reference number |
| transaction_date | date | true | null | Date of transaction |
| subtotal | numeric | true | 0 | Subtotal amount |
| tax_amount | numeric | true | 0 | Tax amount |

RLS Enabled: true

#### 24. farmer_sales

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| farmer_id | uuid | false | null | Foreign key to auth.users.id |
| sale_id | uuid | false | null | Foreign key to market_sales.id |
| broker_id | uuid | false | null | Foreign key to auth.users.id |
| broker_name | text | false | null | Name of broker |
| amount | numeric | false | null | Sale amount |
| net_amount | numeric | false | null | Net amount received |
| sale_date | date | false | null | Date of sale |
| crop_type | text | false | null | Type of crop |
| quantity | numeric | false | null | Quantity sold |
| unit | text | false | null | Unit of measurement |
| market_name | text | false | null | Name of market |
| status | text | false | 'completed' | Status of sale |
| created_at | timestamptz | true | now() | Record creation timestamp |
| updated_at | timestamptz | true | now() | Record update timestamp |

RLS Enabled: true

#### 25. sale_items

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | uuid_generate_v4() | Primary key |
| sale_id | uuid | false | null | Foreign key to market_sales.id |
| crop_name | text | false | null | Name of crop |
| quantity | numeric | false | null | Quantity sold |
| unit | text | false | null | Unit of measurement |
| price_per_unit | numeric | false | null | Price per unit |
| total_amount | numeric | false | null | Total amount |
| grade | text | true | null | Crop grade |
| created_at | timestamptz | true | now() | Record creation timestamp |

RLS Enabled: true

### Auth Schema Tables

The auth schema contains tables that manage user authentication, sessions, identities, and multi-factor authentication.

#### 1. users

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | null | Primary key |
| instance_id | uuid | true | null | Instance identifier |
| email | character varying | true | null | User email address |
| phone | text | true | null | User phone number |
| encrypted_password | character varying | true | null | Encrypted password |
| role | character varying | true | null | User role |
| aud | character varying | true | null | Audience |
| is_anonymous | boolean | false | false | Whether user is anonymous |
| is_sso_user | boolean | false | false | Whether user is using SSO |
| confirmed_at | timestamp with time zone | true | null | When user was confirmed |
| email_confirmed_at | timestamp with time zone | true | null | When email was confirmed |
| phone_confirmed_at | timestamp with time zone | true | null | When phone was confirmed |
| last_sign_in_at | timestamp with time zone | true | null | Last sign-in timestamp |
| recovery_token | character varying | true | null | Password recovery token |
| confirmation_token | character varying | true | null | Email confirmation token |
| raw_app_meta_data | jsonb | true | null | Application metadata |
| raw_user_meta_data | jsonb | true | null | User metadata |
| created_at | timestamp with time zone | true | null | Creation timestamp |
| updated_at | timestamp with time zone | true | null | Update timestamp |
| deleted_at | timestamp with time zone | true | null | Deletion timestamp |

#### 2. identities

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| user_id | uuid | false | null | Foreign key to users.id |
| provider_id | text | false | null | Provider identifier |
| provider | text | false | null | Authentication provider |
| identity_data | jsonb | false | null | Identity data from provider |
| email | text | true | null | User email |
| created_at | timestamp with time zone | true | null | Creation timestamp |
| updated_at | timestamp with time zone | true | null | Update timestamp |
| last_sign_in_at | timestamp with time zone | true | null | Last sign-in timestamp |

#### 3. sessions

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | null | Primary key |
| user_id | uuid | false | null | Foreign key to users.id |
| created_at | timestamp with time zone | true | null | Creation timestamp |
| updated_at | timestamp with time zone | true | null | Update timestamp |
| factor_id | uuid | true | null | MFA factor ID |
| not_after | timestamp with time zone | true | null | Expiration timestamp |
| refreshed_at | timestamp without time zone | true | null | When session was refreshed |
| user_agent | text | true | null | User agent information |
| ip | inet | true | null | IP address |
| tag | text | true | null | Session tag |

#### 4. refresh_tokens

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | bigint | false | nextval sequence | Primary key |
| instance_id | uuid | true | null | Instance identifier |
| token | character varying | true | null | Refresh token |
| user_id | character varying | true | null | User identifier |
| revoked | boolean | true | null | Whether token is revoked |
| created_at | timestamp with time zone | true | null | Creation timestamp |
| updated_at | timestamp with time zone | true | null | Update timestamp |
| parent | character varying | true | null | Parent token |
| session_id | uuid | true | null | Session identifier |

#### 5. mfa_factors

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | null | Primary key |
| user_id | uuid | false | null | Foreign key to users.id |
| friendly_name | text | true | null | Display name for factor |
| factor_type | USER-DEFINED | false | null | Type of MFA factor |
| status | USER-DEFINED | false | null | Status of factor |
| secret | text | true | null | Secret for TOTP |
| phone | text | true | null | Phone number for SMS |
| created_at | timestamp with time zone | false | null | Creation timestamp |
| updated_at | timestamp with time zone | false | null | Update timestamp |
| last_challenged_at | timestamp with time zone | true | null | Last verification attempt |

### Storage Schema Tables

The storage schema contains tables for file storage management, including buckets, objects, and multipart uploads.

#### 1. buckets

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | text | false | null | Primary key |
| name | text | false | null | Bucket name |
| owner | uuid | true | null | Owner user ID |
| owner_id | text | true | null | Alternative owner ID |
| created_at | timestamp with time zone | true | now() | Creation timestamp |
| updated_at | timestamp with time zone | true | now() | Update timestamp |
| public | boolean | true | false | Whether bucket is public |
| avif_autodetection | boolean | true | false | Enable AVIF detection |
| file_size_limit | bigint | true | null | Maximum file size |
| allowed_mime_types | ARRAY | true | null | Allowed file types |

#### 2. objects

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| bucket_id | text | true | null | Foreign key to buckets.id |
| name | text | true | null | Object name/path |
| owner | uuid | true | null | Owner user ID |
| owner_id | text | true | null | Alternative owner ID |
| created_at | timestamp with time zone | true | now() | Creation timestamp |
| updated_at | timestamp with time zone | true | now() | Update timestamp |
| last_accessed_at | timestamp with time zone | true | now() | Last access timestamp |
| metadata | jsonb | true | null | Object metadata |
| path_tokens | ARRAY | true | null | Path segments |
| version | text | true | null | Object version |
| user_metadata | jsonb | true | null | User-defined metadata |

#### 3. s3_multipart_uploads

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | text | false | null | Primary key |
| bucket_id | text | false | null | Foreign key to buckets.id |
| key | text | false | null | Object key |
| upload_signature | text | false | null | Upload signature |
| version | text | false | null | Upload version |
| in_progress_size | bigint | false | 0 | Current upload size |
| owner_id | text | true | null | Owner identifier |
| created_at | timestamp with time zone | false | now() | Creation timestamp |
| user_metadata | jsonb | true | null | User-defined metadata |

#### 4. s3_multipart_uploads_parts

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| upload_id | text | false | null | Foreign key to s3_multipart_uploads.id |
| bucket_id | text | false | null | Bucket identifier |
| key | text | false | null | Object key |
| part_number | integer | false | null | Part sequence number |
| size | bigint | false | 0 | Part size in bytes |
| etag | text | false | null | ETag hash |
| version | text | false | null | Part version |
| owner_id | text | true | null | Owner identifier |
| created_at | timestamp with time zone | false | now() | Creation timestamp |

### Realtime Schema Tables

The realtime schema contains tables that manage the real-time messaging and subscription system for database changes.

#### 1. subscription

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | bigint | false | null | Primary key |
| subscription_id | uuid | false | null | Unique subscription identifier |
| entity | regclass | false | null | Table being subscribed to |
| filters | ARRAY | false | '{}' | Array of filters for events |
| claims | jsonb | false | null | JWT claims of subscriber |
| claims_role | regrole | false | null | Role from JWT claims |
| created_at | timestamp without time zone | false | timezone('utc'::text, now()) | Creation timestamp |

#### 2. messages

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| topic | text | false | null | Message topic |
| event | text | true | null | Event type |
| payload | jsonb | true | null | Message content |
| extension | text | false | null | Extension type |
| private | boolean | true | false | Whether message is private |
| inserted_at | timestamp without time zone | false | now() | Creation timestamp |
| updated_at | timestamp without time zone | false | now() | Update timestamp |

### Vault Schema Tables

The vault schema contains tables for secure storage of secrets and encryption keys.

#### 1. secrets

Primary key: `id`

| Column Name | Data Type | Nullable | Default | Description |
|-------------|-----------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| name | text | true | null | Secret name |
| description | text | false | '' | Secret description |
| secret | text | false | null | Encrypted secret value |
| key_id | uuid | true | null | Encryption key identifier |
| nonce | bytea | true | vault._crypto_aead_det_noncegen() | Encryption nonce |
| created_at | timestamp with time zone | false | CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | timestamp with time zone | false | CURRENT_TIMESTAMP | Update timestamp |

#### 2. decrypted_secrets (View)

This is a view that decrypts secrets for authorized users.

| Column Name | Data Type | Nullable | Description |
|-------------|-----------|----------|-------------|
| id | uuid | true | Secret ID |
| name | text | true | Secret name |
| description | text | true | Secret description |
| secret | text | true | Encrypted secret value |
| decrypted_secret | text | true | Decrypted secret value |
| key_id | uuid | true | Encryption key identifier |
| nonce | bytea | true | Encryption nonce |
| created_at | timestamp with time zone | true | Creation timestamp |
| updated_at | timestamp with time zone | true | Update timestamp |


## Database Functions

The database contains various functions organized by schema that provide important functionality for the application.

### Public Schema Functions

| Function Name | Arguments | Return Type | Description |
|---------------|-----------|-------------|-------------|
| add_to_farmer_sales | | trigger | Trigger function to automatically create farmer_sales records when market_sales are created |
| create_profile_for_user | | trigger | Creates appropriate profile records based on user type |
| decrement_group_members | group_id uuid | void | Decreases member count for KrishiGram groups |
| decrement_group_members_count | group_id uuid | void | Alias for decrement_group_members |
| handle_new_crop_analysis | | trigger | Trigger function for processing crop analysis records |
| handle_new_user | | trigger | Trigger function for new user creation |
| increment_group_members | group_id uuid | void | Increases member count for KrishiGram groups |
| increment_group_members_count | group_id uuid | void | Alias for increment_group_members |
| log_store_owner_profile_changes | | trigger | Logs changes to store_owner_profiles for debugging |
| trigger_create_user_profile | | trigger | Calls edge function to create user profiles via HTTP |
| update_timestamp | | trigger | Updates timestamp columns automatically |

### Auth Schema Functions

| Function Name | Arguments | Return Type | Description |
|---------------|-----------|-------------|-------------|
| email | | text | Retrieves email from JWT claims |
| jwt | | jsonb | Retrieves full JWT claims |
| role | | text | Retrieves role from JWT claims |
| uid | | uuid | Retrieves user ID from JWT claims |

### Extensions Schema Functions

This schema contains numerous utility functions for cryptography, HTTP requests, and other operations provided by Postgres extensions. Key functions include:

| Function Name | Arguments | Return Type | Description |
|---------------|-----------|-------------|-------------|
| http_get | url text, params jsonb, headers jsonb, timeout_milliseconds integer | int8 | Makes HTTP GET requests |
| http_post | url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer | int8 | Makes HTTP POST requests |
| algorithm_sign | signables text, secret text, algorithm text | text | Signs data with specified algorithm |
| verify | token text, secret text, algorithm text | record | Verifies JWT tokens |
| sign | payload json, secret text, algorithm text | text | Creates signed JWT tokens |

### Storage Schema Functions

| Function Name | Arguments | Return Type | Description |
|---------------|-----------|-------------|-------------|
| can_insert_object | bucketid text, name text, owner uuid, metadata jsonb | void | Authorization check for object insertion |
| extension | name text | text | Extracts file extension from filename |
| filename | name text | text | Extracts filename from path |
| foldername | name text | _text | Extracts folder path from full path |
| search | prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text | record | Searches for objects in storage buckets |

### Realtime Schema Functions

Functions supporting Supabase's realtime functionality, enabling websocket-based change notifications:

| Function Name | Arguments | Return Type | Description |
|---------------|-----------|-------------|-------------|
| apply_rls | wal jsonb, max_record_bytes integer | wal_rls | Applies row-level security to WAL changes |
| broadcast_changes | topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text | void | Broadcasts database changes to subscribers |
| is_visible_through_filters | columns wal_column[], filters user_defined_filter[] | bool | Determines if a record is visible through filters |
| send | payload jsonb, event text, topic text, private boolean | void | Sends messages to realtime channels |

## Database Triggers

The database uses various triggers to automate processes and maintain data integrity.

### Authentication Schema Triggers

| Trigger Name | Table | Event | Function | Description |
|--------------|-------|-------|----------|-------------|
| on_auth_user_created | users | AFTER INSERT | handle_new_user() | Creates user records in public schema when auth users are created |
| on_auth_user_created_trigger | users | AFTER INSERT | trigger_create_user_profile() | Calls edge function to set up user profiles |

### Public Schema Triggers

| Trigger Name | Table | Event | Function | Description |
|--------------|-------|-------|----------|-------------|
| update_broker_profiles_timestamp | broker_profiles | BEFORE UPDATE | update_timestamp() | Updates timestamp on record changes |
| update_consumer_profiles_timestamp | consumer_profiles | BEFORE UPDATE | update_timestamp() | Updates timestamp on record changes |
| on_crop_analysis_insert | crop_analyses | AFTER INSERT | handle_new_crop_analysis() | Processes new crop analyses |
| update_expert_profiles_timestamp | expert_profiles | BEFORE UPDATE | update_timestamp() | Updates timestamp on record changes |
| update_farmer_profiles_timestamp | farmer_profiles | BEFORE UPDATE | update_timestamp() | Updates timestamp on record changes |
| add_farmer_sale_on_market_sale_insert | market_sales | AFTER INSERT | add_to_farmer_sales() | Creates farmer sale records |
| store_owner_profile_audit_trig | store_owner_profiles | AFTER INSERT/UPDATE/DELETE | log_store_owner_profile_changes() | Logs profile changes |
| update_store_owner_profiles_timestamp | store_owner_profiles | BEFORE UPDATE | update_timestamp() | Updates timestamp on record changes |
| update_student_profiles_timestamp | student_profiles | BEFORE UPDATE | update_timestamp() | Updates timestamp on record changes |
| update_user_roles_timestamp | user_roles | BEFORE UPDATE | update_timestamp() | Updates timestamp on record changes |
| update_users_timestamp | users | BEFORE UPDATE | update_timestamp() | Updates timestamp on record changes |

### Other Schema Triggers

| Trigger Name | Schema | Table | Event | Function | Description |
|--------------|--------|-------|-------|----------|-------------|
| tr_check_filters | realtime | subscription | BEFORE INSERT/UPDATE | realtime.subscription_check_filters() | Validates subscription filters |
| update_objects_updated_at | storage | objects | BEFORE UPDATE | storage.update_updated_at_column() | Updates timestamps for storage objects |

## Database Indexes

The database uses various indexes to improve query performance and ensure data integrity.

### Important Public Schema Indexes

| Index Name | Table | Type | Definition |
|------------|-------|------|------------|
| users_pkey | users | UNIQUE | Primary key index on id |
| users_email_key | users | UNIQUE | Unique index on email |
| user_roles_email_role_type_key | user_roles | UNIQUE | Unique index on email and role_type combination |
| krishigram_posts_pkey | krishigram_posts | UNIQUE | Primary key index on id |
| unique_post_like | krishigram_likes | UNIQUE | Ensures a user can only like a post once |
| unique_comment_like | krishigram_likes | UNIQUE | Ensures a user can only like a comment once |
| unique_group_member | krishigram_group_members | UNIQUE | Ensures a user can only be member of a group once |
| unique_follower | krishigram_followers | UNIQUE | Prevents duplicate follower relationships |
| market_sales_sale_number_key | market_sales | UNIQUE | Ensures unique sale numbers |

### Functional Indexes

Several functional indexes exist to optimize specific query patterns:

| Index Name | Schema | Table | Purpose |
|------------|--------|-------|---------|
| idx_crop_analysis_user_id | public | crop_analysis_history | Improves user-based crop analysis queries |
| idx_farmer_sales_farmer_id | public | farmer_sales | Speeds up farmer sales lookup |
| idx_farmer_sales_broker_id | public | farmer_sales | Speeds up broker-based queries |
| market_sales_broker_id_idx | public | market_sales | Optimizes broker sales reporting |
| name_prefix_search | storage | objects | Optimizes prefix-based storage object searches |

### Authentication System Indexes

The auth schema contains numerous indexes to optimize authentication operations:

| Index Name | Table | Type | Purpose |
|------------|-------|------|---------|
| users_email_partial_key | users | UNIQUE | Enforces unique emails for non-SSO users |
| users_phone_key | users | UNIQUE | Ensures unique phone numbers |
| sessions_user_id_idx | sessions | BTREE | Optimizes user session lookups |
| refresh_tokens_token_unique | refresh_tokens | UNIQUE | Ensures token uniqueness |
| identities_user_id_idx | identities | BTREE | Speeds up identity lookups by user ID |

## Storage System

KrishiSagar uses Supabase Storage for file storage needs. All storage tables have Row Level Security (RLS) enabled to ensure secure access control.

### Storage Tables

| Table Name | Has Indexes | Has Triggers | Row Security | Purpose |
|------------|-------------|--------------|--------------|---------|
| buckets | Yes | Yes | Yes | Defines storage buckets for different purposes |
| objects | Yes | Yes | Yes | Stores files and metadata |
| migrations | Yes | No | Yes | Storage system migrations |
| s3_multipart_uploads | Yes | Yes | Yes | Handles chunked file uploads |
| s3_multipart_uploads_parts | Yes | Yes | Yes | Stores parts of multipart uploads |

### Storage Buckets

The platform uses several storage buckets for different content types:

1. **crop-images** - Stores images of crops uploaded by farmers for analysis
2. **profiles** - User profile pictures and related media
3. **krishigram-media** - Images and videos for social media posts
4. **documents** - Reports, analysis documents, and educational materials

Each bucket has specific RLS policies to control access based on user roles:

- Farmers can access their own crop images and soil analysis files
- Social media content in krishigram-media is accessible based on the post's visibility settings
- Profile images have public read but restricted write access

## Installed Extensions

| Extension Name | Schema | Version | Description |
|----------------|--------|---------|-------------|
| plpgsql | pg_catalog | 1.0 | PL/pgSQL procedural language |
| uuid-ossp | extensions | 1.1 | Generate universally unique identifiers (UUIDs) |
| pg_stat_monitor | extensions | 2.1 | Query Performance Monitoring tool |
| postgres_fdw | extensions | 1.1 | Foreign-data wrapper for remote PostgreSQL servers |
| pg_stat_statements | extensions | 1.10 | Track planning and execution statistics of all SQL statements executed |
| pg_net | extensions | 0.14.0 | Async HTTP |
| pgjwt | extensions | 0.2.0 | JSON Web Token API for PostgreSQL |
| pgcrypto | extensions | 1.3 | Cryptographic functions |
| pg_graphql | graphql | 1.5.11 | GraphQL support |
| supabase_vault | vault | 0.3.1 | Supabase Vault Extension |

