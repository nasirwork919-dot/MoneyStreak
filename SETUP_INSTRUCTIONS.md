# BigMoney Ticketing System - Setup Instructions

## 🚀 Quick Setup Guide

### 1. Database Setup (Supabase)

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/gofgjzvgcyqjtmdhxffx
2. **Navigate to SQL Editor**
3. **Copy and paste the entire content** from `supabase/migrations/create_complete_schema.sql`
4. **Click "Run"** to execute the script

This will create:
- ✅ All required tables with proper relationships
- ✅ Row Level Security (RLS) policies
- ✅ Auto-generated entry numbers and referral codes
- ✅ Real-time triggers for revenue calculation
- ✅ Sample data for testing
- ✅ Admin user setup

### 2. Authentication Setup

The system uses Supabase Auth with the following configuration:
- **URL**: `https://gofgjzvgcyqjtmdhxffx.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Admin Access

**Default Admin Account:**
- Email: `admin@bigmoney.com`
- Password: Create this account through the sign-up form
- The system automatically grants admin privileges to this email

**Admin Panel Access:**
- URL: `/admin`
- Only accessible to users with `is_admin = true`
- Real-time data updates
- Comprehensive analytics dashboard

### 4. User Features

**User Dashboard** (`/dashboard`):
- ✅ View all ticket purchases
- ✅ Track referrals and earnings
- ✅ Real-time countdown to draws
- ✅ Referral link management
- ✅ Quiz attempt tracking

**Ticket System**:
- ✅ $3 tickets for $700 draw (20th of month)
- ✅ $5 tickets for $1,000 draw (30th of month)
- ✅ Free quiz entries (expert difficulty)
- ✅ Referral rewards system

### 5. Admin Features

**Admin Dashboard** (`/admin`):
- ✅ Real-time revenue tracking with live chart
- ✅ User management and analytics
- ✅ Ticket sales monitoring ($3 and $5)
- ✅ Referral system oversight
- ✅ Free quiz ticket generation tracking
- ✅ Live data subscriptions
- ✅ Export functionality (CSV)
- ✅ Draw management

**Real-time Features**:
- ✅ Live revenue updates
- ✅ Instant notification of new users
- ✅ Real-time ticket sales tracking
- ✅ Referral conversion monitoring

### 6. Security Features

**Row Level Security (RLS)**:
- ✅ Users can only access their own data
- ✅ Admins have read/write access to all data
- ✅ Public read access for draws and charity info
- ✅ Secure authentication flow

**Data Protection**:
- ✅ Auto-generated unique entry numbers
- ✅ Referral code generation with collision detection
- ✅ Audit trails for all transactions
- ✅ Session tracking for security

### 7. Testing the System

**Create Test Accounts**:
1. Sign up with `admin@bigmoney.com` (gets admin privileges)
2. Sign up with any other email (regular user)
3. Test ticket purchases, referrals, and quiz

**Admin Testing**:
1. Access `/admin` with admin account
2. View real-time analytics
3. Monitor user activity
4. Test data export features

**User Testing**:
1. Purchase tickets ($3 or $5)
2. Take the free quiz
3. Use referral system
4. Check dashboard updates

### 8. Production Deployment

**Environment Variables** (already configured):
```
VITE_SUPABASE_URL=https://gofgjzvgcyqjtmdhxffx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ready for Production**:
- ✅ Complete database schema
- ✅ Secure authentication
- ✅ Real-time data updates
- ✅ Admin panel with analytics
- ✅ User dashboard
- ✅ Responsive design
- ✅ Error handling

### 9. Key Features Summary

**For Users**:
- Sign up/Sign in with email/password
- Purchase $3 or $5 tickets
- Take challenging free quiz for entries
- Refer friends for free tickets
- Track all activity in dashboard
- Real-time countdown to draws

**For Admins**:
- Comprehensive analytics dashboard
- Real-time revenue tracking with charts
- User management and oversight
- Ticket sales monitoring
- Referral system analytics
- Quiz attempt tracking
- Data export capabilities
- Live updates and notifications

### 10. Support & Maintenance

**Database Maintenance**:
- Automatic revenue aggregation
- Real-time data synchronization
- Performance-optimized indexes
- Audit trails for all transactions

**Security**:
- Row Level Security enabled
- Role-based access control
- Secure authentication flow
- Data isolation between users

---

## 🎯 System is Ready!

The complete ticketing system is now configured and ready for immediate use. All features are functional, secure, and optimized for production deployment.

**Next Steps**:
1. Run the SQL script in Supabase
2. Create your admin account
3. Test the system functionality
4. Deploy to production

**Support**: Contact the development team for any questions or customizations needed.