# StoelAirbag Template

Een complete, professionele website template voor StoelAirbag - gespecialiseerd in airbag reparatie en stoelbekleding herstel voor auto's.

![StoelAirbag](https://via.placeholder.com/800x400/FF6B35/FFFFFF?text=StoelAirbag)

## 🚀 Features

### Website
- ✅ **Responsive design** - Werkt perfect op desktop, tablet en mobiel
- ✅ **Moderne UI/UX** - Professionele uitstraling met animaties
- ✅ **Meertalig** - NL/EN toggle (klaar voor vertaling)

### Pagina's
- 🏠 **Home** - Met hero, USP's, diensten, kentekenchecker, stoelchecker quiz, reviews
- 🛒 **Webshop** - Productcatalogus met filters, winkelwagen, kentekenzoeker
- 📞 **Contact** - Formulier, contactgegevens, FAQ, Google Maps
- ℹ️ **Over Ons** - Team, statistieken, kernwaarden
- 🔧 **Diensten** (4 pagina's) - Airbag, bekleding, renovatie, A-tot-Z service
- 📄 **Juridisch** - Privacybeleid & Algemene Voorwaarden

### Functionaliteiten
- 🛍️ **Winkelwagen** - localStorage gebaseerd, volledig functioneel
- 🔍 **Kentekenchecker** - Zoek producten op basis van kenteken (RDW API ready)
- 🎯 **Stoelchecker Quiz** - 5-vragen adviestool
- 💳 **Shopify Integratie** - Klaar voor Shopify aansluiting
- 📱 **WhatsApp integratie** - Direct contact button
- 🔔 **Notificaties** - Toast meldingen bij acties

## 📁 Structuur

```
stoelairbag-template/
├── index.html              # Homepage
├── css/
│   ├── style.css          # Hoofd stylesheet
│   └── pages.css          # Pagina-specifieke styles
├── js/
│   ├── main.js            # Algemene functionaliteit
│   └── shop.js            # Winkelwagen & shop functionaliteit
├── pages/
│   ├── webshop.html       # Webshop pagina
│   ├── contact.html       # Contact pagina
│   ├── over-ons.html      # Over ons pagina
│   ├── airbag-reparatie.html
│   ├── stoelbekleding.html
│   ├── complete-renovatie.html
│   ├── ato-z-service.html
│   ├── privacy.html       # Privacybeleid
│   └── algemene-voorwaarden.html
├── images/                # Afbeeldingen (placeholder)
└── products/              # Product data
```

## 🛠️ Installatie

### Lokale ontwikkeling
```bash
# Clone de repository
git clone https://github.com/battletron1337gh/stoelairbag-template.git

# Ga naar de folder
cd stoelairbag-template

# Start een lokale server
python3 -m http.server 8080
# of
npx serve .

# Open in browser
http://localhost:8080
```

## 🔌 Shopify Integratie

De template is voorbereid voor Shopify integratie:

### 1. Shopify Storefront API configuratie
Bewerk `js/shop.js` en vul je gegevens in:

```javascript
this.shopifyConfig = {
    domain: 'jouw-shop.myshopify.com',
    storefrontAccessToken: 'jouw-storefront-token',
    apiVersion: '2024-01'
};
```

### 2. Storefront Access Token aanmaken
1. Ga naar je Shopify admin
2. Settings > Apps and sales channels > Develop apps
3. Create an app > Configure Storefront API
4. Selecteer benodigde scopes (read_products, read_checkouts)
5. Install app > Copy Storefront access token

### 3. Producten synchroniseren
- Gebruik Shopify product ID's in de HTML
- Of implementeer de Shopify Buy Button

### 4. Checkout opties

**Optie A: Redirect checkout (eenvoudig)**
- Gebruikt de ingebouwde `buildShopifyCartUrl()` functie
- Redirect naar Shopify cart pagina

**Optie B: Embedded checkout (geavanceerd)**
- Gebruikt Shopify Storefront API GraphQL
- Volledige controle over checkout flow

## 🎨 Customization

### Kleuren aanpassen
De CSS custom properties staan bovenaan `css/style.css`:

```css
:root {
    --primary: #FF6B35;        /* Hoofdkleur */
    --primary-dark: #E55A2B;   /* Donkerdere tint */
    --secondary: #2D3142;      /* Secundaire kleur */
    --accent: #4ECDC4;         /* Accentkleur */
    --light: #F7F7F7;          /* Achtergrond */
    --dark: #1A1A2E;           /* Tekst */
}
```

### Logo vervangen
Vervang in de HTML:
```html
<a href="index.html" class="logo">
    <i class="fas fa-airbag logo-icon"></i>
    <span>StoelAirbag</span>
</a>
```

### Contactgegevens aanpassen
Update in alle HTML bestanden:
- Telefoon: `06-12345678` → jouw nummer
- E-mail: `info@stoelairbag.nl` → jouw e-mail
- Adres: `Autoweg 123, 1234 AB Amsterdam` → jouw adres
- WhatsApp: `31612345678` → jouw WhatsApp nummer

## 📱 PWA Ready

De template is voorbereid als Progressive Web App:
- Manifest.json ready
- Service worker ready
- Icons en splash screens ready

## 🔒 SEO & Performance

- ✅ Semantic HTML5
- ✅ Meta tags voor elk platform
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Schema.org structured data ready
- ✅ Lazy loading images
- ✅ Geoptimaliseerde CSS/JS

## 🌐 Browser Support

- Chrome/Edge (laatste 2 versies)
- Firefox (laatste 2 versies)
- Safari (laatste 2 versies)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 Licentie

Dit project is beschikbaar voor commercieel gebruik. 

---

**Gemaakt voor StoelAirbag** | 2026
