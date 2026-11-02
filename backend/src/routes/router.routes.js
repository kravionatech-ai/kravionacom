import express from "express";
import { createAccount, getMe, loginAccountWithPassword, logoutUser, updateMyAccount } from "../controllers/auth/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import { createCategory, deleteCategory, getAllCategories, getCategories, getCategoryByIdOrSlug, updateCategory } from "../controllers/categories/categories.controller.js";
import { createPost, deletePost, privatePosts, privateViewPost, publicPosts, singleViewPost, updatePost } from "../controllers/post/post.controller.js";
import { deleteMedia, getMyMedias, uploadMedia } from "../controllers/media/media.contollers.js";
import { mediaUploadMiddleware, upload, uploadMiddleware } from "../middleware/upload.middleware.js";
import { createNewsLatter, deleteSubscriber, getAllSubscribers } from "../controllers/newslatter/newslatter.controller.js";
import { createMessage, deleteMessage, getAllMessages, getMessageById, updateMessage } from "../controllers/messages/message.controller.js";
import { createLead, deleteLead, getAllLeads, getLeadById, updateLead } from "../controllers/leads/lead.controller.js";
import { getDashboardAnalytics } from "../controllers/analytics/analytics.controller.js";
import { getAdvancedAnalytics } from "../controllers/analytics/advanced-analytics.controller.js";
import { createPostComment, getPostEngagement, recordPostView } from "../controllers/blog-engagement/blog-engagement.controller.js";
import { deleteComment, getAllComments, updateComment } from "../controllers/comments/comments.controller.js";
import { createTeamMember, deleteTeamMember, getAllTeamMembers, getPublicTeamMembers, updateTeamMember } from "../controllers/team/team.controller.js";
import { createUser, deleteUser, getAllUsers, updateUser } from "../controllers/users/users.controller.js";
import { mcpLogin } from "../controllers/mcp/mcp.auth.controller.js";
import { getPublicProjects, getPublicServices } from "../controllers/public-catalog/public-catalog.controller.js";
import { createProject, deleteProject, getProjects, getPublicProject, updateProject } from "../controllers/portfolio/portfolio.controller.js";
import { getLoginHistory } from "../controllers/login-history/login-history.controller.js";
import { createService, deleteService, getPublicServiceBySlug, getServices, updateService } from "../controllers/services/services.controller.js";
import { getPublicKey, subscribeToBlogPush, unsubscribeFromBlogPush } from "../controllers/notifications/blog-push.controller.js";
import { createCareer, deleteCareer, getAdminCareers, getPublicCareerBySlug, getPublicCareers, updateCareer } from "../controllers/careers/careers.controller.js";
import { getCodeInjection, getSetting, updateSetting } from "../controllers/settings/siteSettings.controller.js";
import { createRedirect, deleteRedirect, getPublicRedirects, getRedirects, updateRedirect } from "../controllers/settings/redirects.controller.js";
import { chatbotSecurityMiddleware } from "../middleware/chatbot.security.js";
import { chatWithAssistant, getChatbotHealth, getSuggestions, syncChatbotIndex, getAdminChatLogs, deleteAdminChatLog } from "../controllers/chatbot/chatbot.controller.js";
import { formRateLimiter } from "../middleware/rateLimiter.js";
import {
  getConversations,
  getConversationById,
  updateConversation,
  postReply,
  composeEmail,
  retryEmail,
  getSentEmails,
  getFailedEmails,
  getEmailStats,
  testSendEmail,
  handleResendWebhook,
} from "../controllers/email/email.controller.js";

const Router = express.Router();

export default Router;

// Auth Routing
Router.post('/create-account', createAccount);
Router.post('/login', loginAccountWithPassword);
Router.get('/me', verifyToken, getMe);
Router.patch('/me', verifyToken, updateMyAccount);
Router.post('/auth/logout', verifyToken, logoutUser);

// Analytics
Router.get('/analytics/dashboard', verifyToken, getDashboardAnalytics);
Router.get('/analytics/insights', verifyToken, getAdvancedAnalytics);

// Users & team
Router.get('/users', verifyToken, getAllUsers);
Router.post('/users', verifyToken, createUser);
Router.patch('/users/:id', verifyToken, updateUser);
Router.delete('/users/:id', verifyToken, deleteUser);
Router.get('/login-history', verifyToken, getLoginHistory);

Router.get('/team', verifyToken, getAllTeamMembers);
Router.post('/team', verifyToken, createTeamMember);
Router.patch('/team/:id', verifyToken, updateTeamMember);
Router.delete('/team/:id', verifyToken, deleteTeamMember);
Router.get('/public/team', getPublicTeamMembers);

// Public catalog used by the marketing site.
Router.get('/services', getPublicServices);
Router.get('/services/:slug', getPublicServiceBySlug);
Router.get('/admin/services', verifyToken, getServices);
Router.post('/admin/services', verifyToken, createService);
Router.patch('/admin/services/:id', verifyToken, updateService);
Router.delete('/admin/services/:id', verifyToken, deleteService);
Router.get('/projects', getPublicProjects);
Router.get('/projects/:slug', getPublicProject);
Router.get('/admin/projects', verifyToken, getProjects);
Router.post('/admin/projects', verifyToken, createProject);
Router.patch('/admin/projects/:id', verifyToken, updateProject);
Router.delete('/admin/projects/:id', verifyToken, deleteProject);

// Careers
Router.get('/careers', getPublicCareers);
Router.get('/careers/:slug', getPublicCareerBySlug);
Router.get('/admin/careers', verifyToken, getAdminCareers);
Router.post('/admin/careers', verifyToken, createCareer);
Router.patch('/admin/careers/:id', verifyToken, updateCareer);
Router.delete('/admin/careers/:id', verifyToken, deleteCareer);

// Comment moderation
Router.get('/comments', verifyToken, getAllComments);
Router.patch('/comments/:id', verifyToken, updateComment);
Router.delete('/comments/:id', verifyToken, deleteComment);

// Category 
Router.post('/create-category', verifyToken, createCategory);
Router.get('/categories', getCategories);
Router.get('/categories/all', verifyToken, getAllCategories);
Router.get('/category/:id', getCategoryByIdOrSlug);
Router.put('/category/:id', verifyToken, updateCategory);
Router.delete('/category/:id', verifyToken, deleteCategory);

Router.post("/mcp-login", mcpLogin);

// Post Routing
Router.post('/create-post', verifyToken, uploadMiddleware, createPost);
Router.get("/public/posts", publicPosts);
Router.get("/private/posts", verifyToken, privatePosts);
Router.delete('/post/:id', verifyToken, deletePost);
Router.patch('/post/:id', verifyToken, uploadMiddleware, updatePost);
Router.get('/post/:slug/engagement', getPostEngagement);
Router.post('/post/:slug/views', recordPostView);
Router.post('/post/:slug/comments', createPostComment);
Router.get('/post/:slug', singleViewPost);

// Blog-only Web Push subscriptions.
Router.get('/push/blog/public-key', getPublicKey);
Router.post('/push/blog/subscribe', subscribeToBlogPush);
Router.delete('/push/blog/unsubscribe', unsubscribeFromBlogPush);

Router.get('/private/post/:id', verifyToken, privateViewPost);

// Media Folder
Router.post('/media/upload', verifyToken, mediaUploadMiddleware, uploadMedia);
Router.get('/media/me', verifyToken, getMyMedias);
Router.delete('/media/:id', verifyToken, deleteMedia);

// subscriber
Router.post('/newslatter', createNewsLatter);
Router.get('/newslatter', verifyToken, getAllSubscribers);
Router.delete('/newslatter/:id', verifyToken, deleteSubscriber);

// messages (Protected by spam/rate limiter on POST)
Router.post('/messages', formRateLimiter, createMessage);
Router.get('/messages', verifyToken, getAllMessages);
Router.get('/messages/:id', verifyToken, getMessageById);
Router.patch('/messages/:id', verifyToken, updateMessage);
Router.delete('/messages/:id', verifyToken, deleteMessage);

// leads (Protected by spam/rate limiter on POST)
Router.post('/leads', formRateLimiter, createLead);
Router.get('/leads', verifyToken, getAllLeads);
Router.get('/leads/:id', verifyToken, getLeadById);
Router.patch('/leads/:id', verifyToken, updateLead);
Router.delete('/leads/:id', verifyToken, deleteLead);

// ─── Resend Email Management & Inbound Webhooks ─────────────────────────────
// Resend Webhook: Svix signed webhook endpoint for delivery, bounce, and receiving events
Router.post('/emails/webhook', handleResendWebhook);

// Super Admin Email Management API
Router.get('/emails/stats', verifyToken, getEmailStats);
Router.get('/emails/conversations', verifyToken, getConversations);
Router.get('/emails/conversations/:id', verifyToken, getConversationById);
Router.patch('/emails/conversations/:id', verifyToken, updateConversation);
Router.post('/emails/conversations/:id/reply', verifyToken, postReply);
Router.post('/emails/compose', verifyToken, composeEmail);
Router.get('/emails/messages/sent', verifyToken, getSentEmails);
Router.get('/emails/messages/failed', verifyToken, getFailedEmails);
Router.post('/emails/messages/:id/retry', verifyToken, retryEmail);
Router.post('/emails/test-send', verifyToken, testSendEmail);

// ─── Site Settings ───────────────────────────────────────────────────────────
Router.get('/public/settings/code-injection', getCodeInjection);
Router.get('/admin/settings/:key', verifyToken, getSetting);
Router.put('/admin/settings/:key', verifyToken, updateSetting);

// ─── Redirect Management ─────────────────────────────────────────────────────
Router.get('/public/redirects', getPublicRedirects);
Router.get('/admin/redirects', verifyToken, getRedirects);
Router.post('/admin/redirects', verifyToken, createRedirect);
Router.put('/admin/redirects/:id', verifyToken, updateRedirect);
Router.delete('/admin/redirects/:id', verifyToken, deleteRedirect);

// ─── Public AI Chatbot (Zero Super-Admin Auth, Strictly Public Data) ───────────
Router.post('/chatbot/chat', chatbotSecurityMiddleware, chatWithAssistant);
Router.get('/chatbot/suggestions', getSuggestions);
Router.get('/chatbot/health', getChatbotHealth);
Router.post('/chatbot/sync', verifyToken, syncChatbotIndex);
Router.get('/admin/chatbot/logs', verifyToken, getAdminChatLogs);
Router.delete('/admin/chatbot/logs/:id', verifyToken, deleteAdminChatLog);
