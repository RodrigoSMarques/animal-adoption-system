# Setup Guide - Sistema de Adoção de Animais

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Back4App account (free tier available)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Back4App

#### Create a Back4App Account
1. Go to [https://www.back4app.com/](https://www.back4app.com/)
2. Sign up for a free account
3. Create a new application

#### Get Your Credentials
1. In your Back4App dashboard, click on your app
2. Go to "App Settings" > "Security & Keys"
3. Copy your:
   - Application ID
   - JavaScript Key

#### Update Environment Files

Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  back4app: {
    appId: 'YOUR_APPLICATION_ID_HERE',
    javascriptKey: 'YOUR_JAVASCRIPT_KEY_HERE',
    serverURL: 'https://parseapi.back4app.com'
  }
};
```

Edit `src/environments/environment.prod.ts` with the same values but set `production: true`.

### 3. Run the Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser.

### 4. Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📊 Database Schema

The application will automatically create the following classes in Back4App:

### User (Native Parse Class)
- **username**: String - Unique username
- **email**: String - User email
- **password**: String - Encrypted password
- **userType**: String - "doador" or "adotante"
- **telefone**: String - Phone number
- **cidade**: String - City
- **estado**: String - State (UF)

### Animal
- **nome**: String - Animal name
- **especie**: String - "cachorro", "gato", or "outro"
- **raca**: String - Breed
- **idade**: Number - Age in years
- **sexo**: String - "macho" or "femea"
- **porte**: String - "pequeno", "medio", or "grande"
- **descricao**: String - Detailed description
- **fotos**: Array - URLs of uploaded photos
- **localizacao**: GeoPoint - GPS coordinates
- **cidade**: String - City
- **estado**: String - State
- **status**: String - "disponivel" or "adotado"
- **doador**: Pointer<User> - Reference to the donor

### Contact
- **animal**: Pointer<Animal> - Reference to the animal
- **adotante**: Pointer<User> - Reference to the adopter
- **doador**: Pointer<User> - Reference to the donor
- **mensagem**: String - Message content

## 🔒 Security Recommendations

### Production Setup
1. Never commit your actual Back4App credentials to version control
2. Use environment variables or secure configuration management
3. Set up proper CORS rules in Back4App dashboard
4. Enable email verification for users if needed
5. Configure proper ACLs (Access Control Lists) in Back4App

### Back4App Security Settings
1. Go to your app's "Server Settings"
2. Enable "Require user session" for sensitive operations
3. Set up email verification if required
4. Configure allowed origins for CORS

## 🧪 Testing the Application

### Test User Accounts

You'll need to create test accounts through the registration page:

1. **Doador Account**: Register with userType "doador" to test animal registration
2. **Adotante Account**: Register with userType "adotante" to test contacting donors

### Test Workflow

1. **Register as Doador**
   - Go to `/register`
   - Fill in all fields
   - Select "Doador" as user type
   - Submit

2. **Add an Animal**
   - Login with doador account
   - Go to "Cadastrar Animal"
   - Fill in animal details
   - Upload photos
   - Use geolocation or enter coordinates manually
   - Submit

3. **Browse as Adotante**
   - Logout and register as "Adotante"
   - Go to "Animais" page
   - Use filters to search
   - Click on an animal to view details
   - Send a message to the donor

4. **Check Contacts**
   - Go to "Perfil"
   - View received contacts (as doador)
   - View sent contacts (as adotante)

## 🐛 Troubleshooting

### Build Warnings

**Bundle size warning**: This is normal for applications using Parse SDK. The initial bundle is slightly over 500KB but well optimized for production.

**CommonJS warning**: Parse SDK is a CommonJS module. This is expected and doesn't affect functionality.

### Common Issues

**Parse initialization error**
- Check that your Back4App credentials are correct
- Ensure serverURL is set to `https://parseapi.back4app.com`

**CORS errors**
- Configure allowed origins in Back4App dashboard
- For development, allow `http://localhost:4200`

**Geolocation not working**
- Browsers require HTTPS for geolocation (except localhost)
- User must grant permission when prompted

**Photos not uploading**
- Check file size limits in Back4App settings
- Ensure internet connection is stable
- Check browser console for specific errors

## 📱 Mobile Testing

The application is fully responsive. Test on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Different screen sizes using browser dev tools

## 🚢 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/animal-adoption-app folder to Netlify
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Remember to set production environment variables in your hosting platform!

## 📞 Support

For issues or questions:
1. Check this setup guide
2. Review the main README.md
3. Check Back4App documentation: https://docs.back4app.com/
4. Review Angular documentation: https://angular.dev/

## 🎉 You're All Set!

Your animal adoption system is ready to use. Happy coding! 🐾
