import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import VocabPage from "./pages/VocabPage";
import StoryPage from "./pages/StoryPage";
import StoryDetail from "./features/story/StoryDetail";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./features/news/NewsDetail";
import CMSPage from "./pages/CMSPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CMSDashboard from "./features/cms/CMSDashboard";
import VocabManager from "./features/cms/VocabManager";
import VocabAddForm from "./features/cms/VocabAddForm"; // <-- IMPORT BARU
import VocabEditForm from "./features/cms/VocabEditForm"; // <-- IMPORT BARU
import StoryManager from "./features/cms/StoryManager";
import StoryForm from "./features/cms/StoryForm";
import NewsManager from "./features/cms/NewsManager";
import NewsForm from "./features/cms/NewsForm";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/vocab" element={<VocabPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />

          <Route path="/cms" element={<ProtectedRoute />}>
            <Route element={<CMSPage />}>
              <Route index element={<CMSDashboard />} />
              <Route path="vocab" element={<VocabManager />} />
              <Route path="vocab/new" element={<VocabAddForm />} />{" "}
              {/* <-- ROUTE BARU */}
              <Route path="vocab/edit/:id" element={<VocabEditForm />} />{" "}
              {/* <-- ROUTE BARU */}
              <Route path="stories" element={<StoryManager />} />
              <Route path="stories/new" element={<StoryForm />} />
              <Route path="stories/edit/:id" element={<StoryForm />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="news/new" element={<NewsForm />} />
              <Route path="news/edit/:id" element={<NewsForm />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
