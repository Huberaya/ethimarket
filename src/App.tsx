import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Code-splitting : chaque page est un chunk séparé (bundle initial réduit)
const Catalogue = lazy(() => import('./pages/Catalogue'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Register = lazy(() => import('./pages/Register'));
const ProducerShop = lazy(() => import('./pages/ProducerShop'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));
const Contact = lazy(() => import('./pages/Contact'));
const DevenirVendeur = lazy(() => import('./pages/DevenirVendeur'));
const NotreMission = lazy(() => import('./pages/NotreMission'));
const TrustCenter = lazy(() => import('./pages/TrustCenter'));
const Tarifs = lazy(() => import('./pages/InstitutionalPages').then(m => ({ default: m.Tarifs })));
const NotreEquipe = lazy(() => import('./pages/InstitutionalPages').then(m => ({ default: m.NotreEquipe })));
const CertificationsPage = lazy(() => import('./pages/InstitutionalPages').then(m => ({ default: m.CertificationsPage })));
const Presse = lazy(() => import('./pages/InstitutionalPages').then(m => ({ default: m.Presse })));
const Partenaires = lazy(() => import('./pages/InstitutionalPages').then(m => ({ default: m.Partenaires })));
const CentreAide = lazy(() => import('./pages/InstitutionalPages').then(m => ({ default: m.CentreAide })));
const BuyerWorkspace = lazy(() => import('./pages/dashboard/BuyerWorkspace'));
const SupplierSourcing = lazy(() => import('./pages/dashboard/SupplierSourcing'));
const DocumentVault = lazy(() => import('./pages/dashboard/DocumentVault'));
const Producers = lazy(() => import('./pages/Producers'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AddProduct = lazy(() => import('./pages/dashboard/AddProduct'));
const EditProduct = lazy(() => import('./pages/dashboard/EditProduct'));
const MyProducts = lazy(() => import('./pages/dashboard/MyProducts'));
const MyShop = lazy(() => import('./pages/dashboard/MyShop'));
const MonProfil = lazy(() => import('./pages/dashboard/MonProfil'));
const Messages = lazy(() => import('./pages/dashboard/Messages'));
const SettingsPage = lazy(() => import('./pages/dashboard/PlaceholderPages').then(m => ({ default: m.SettingsPage })));
const QuotesPage = lazy(() => import('./pages/dashboard/QuotesPage'));
const OrdersPage = lazy(() => import('./pages/dashboard/OrdersPage'));
const OrganizationPage = lazy(() => import('./pages/dashboard/OrganizationPage'));
const Verification = lazy(() => import('./pages/dashboard/Verification'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducers = lazy(() => import('./pages/admin/Producers'));
const AdminVerificationsPage = lazy(() => import('./pages/admin/Verifications'));
const AdminVerificationDetail = lazy(() => import('./pages/admin/AdminVerificationDetail'));
const AdminCertBodies = lazy(() => import('./pages/admin/AdminCertBodies'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminDisputes = lazy(() => import('./pages/admin/Disputes'));
const AdminIncidents = lazy(() => import('./pages/admin/Incidents'));
const AdminFinances = lazy(() => import('./pages/admin/Finances'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const ScoreEthiMarket = lazy(() => import('./pages/ScoreEthiMarket'));
const CertificationsDashboard = lazy(() => import('./pages/admin/CertificationsDashboard'));
const ProducerCertificationsList = lazy(() => import('./pages/admin/ProducerCertificationsList'));
const ProducerCertificationDetail = lazy(() => import('./pages/admin/ProducerCertificationDetail'));
const AdminCertBodiesDirectory = lazy(() => import('./pages/admin/AdminCertBodiesDirectory'));
const AdminCertBodyDetail = lazy(() => import('./pages/admin/AdminCertBodyDetail'));
const AdminMessageTemplates = lazy(() => import('./pages/admin/AdminMessageTemplates'));
import BackToTop from './components/BackToTop';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';

// Module mondial de vérification des certifications (Étape 5)

export default function App() {
  return (
    <BrowserRouter>
      <BackToTop />
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" aria-label="Chargement" />
        </div>
      }>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/produits/:id" element={<ProductDetail />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/boutique/:id" element={<ProducerShop />} />
        <Route path="/comment-ca-marche" element={<HowItWorks />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/devenir-vendeur" element={<DevenirVendeur />} />
        <Route path="/notre-mission" element={<NotreMission />} />
        <Route path="/trust-center" element={<TrustCenter />} />
        <Route path="/producteurs" element={<Producers />} />
        <Route path="/conditions-utilisation" element={<Legal />} />
        <Route path="/confidentialite" element={<Legal />} />
        <Route path="/cookies" element={<Legal />} />
        <Route path="/notre-equipe" element={<NotreEquipe />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/presse" element={<Presse />} />
        <Route path="/partenaires" element={<Partenaires />} />
        <Route path="/centre-aide" element={<CentreAide />} />
        <Route path="/tarifs" element={<Tarifs />} />

        {/* Dashboard routes (protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="mes-achats" element={<BuyerWorkspace />} />
          <Route path="organisation" element={<OrganizationPage />} />
          <Route path="sourcing" element={<SupplierSourcing />} />
          <Route path="documents" element={<DocumentVault />} />
          <Route path="mes-produits" element={<MyProducts />} />
          <Route path="ajouter-produit" element={<AddProduct />} />
          <Route path="modifier-produit/:id" element={<EditProduct />} />
          <Route path="ma-boutique" element={<MyShop />} />
          <Route path="mon-profil" element={<MonProfil />} />
          <Route path="devis" element={<QuotesPage />} />
          <Route path="commandes" element={<OrdersPage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="parametres" element={<SettingsPage />} />
          <Route path="verification" element={<Verification />} />
        </Route>
        <Route path="/score-ethimarket" element={<ScoreEthiMarket />} />

        {/* Admin routes (protected by admin role) */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="producteurs" element={<AdminProducers />} />
          <Route path="verifications" element={<AdminVerificationsPage />} />
          <Route path="verification/:producerId" element={<AdminVerificationDetail />} />
          <Route path="organismes" element={<AdminCertBodies />} />
          
          {/* Nouvelles routes Certifications & Audit (Étape 5) */}
          <Route path="certifications" element={<CertificationsDashboard />} />
          <Route path="certifications/producers" element={<ProducerCertificationsList />} />
          <Route path="certifications/producers/:id" element={<ProducerCertificationDetail />} />
          <Route path="certifications/bodies" element={<AdminCertBodiesDirectory />} />
          <Route path="certifications/bodies/:id" element={<AdminCertBodyDetail />} />
          <Route path="certifications/templates" element={<AdminMessageTemplates />} />

          <Route path="produits" element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="litiges" element={<AdminDisputes />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="incidents" element={<AdminIncidents />} />
          <Route path="finances" element={<AdminFinances />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="configuration" element={<AdminReports />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
