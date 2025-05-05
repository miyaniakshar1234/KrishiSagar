"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  getCurrentUser, 
  getKrishiGramPosts, 
  createKrishiGramPost, 
  likeKrishiGramPost, 
  unlikeKrishiGramPost, 
  commentOnKrishiGramPost, 
  getKrishiGramComments,
  getKrishiGramGroups,
  joinKrishiGramGroup
} from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface KrishiGramPost {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  created_at: string;
  likes: number;
  comments_count: number;
  user_full_name: string;
  user_avatar_url?: string;
  type: 'reel' | 'post' | 'story';
  tags?: string[];
  location?: string;
  media_type?: string;
  isLiked?: boolean;
}

interface KrishiGramComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_full_name: string;
  user_avatar_url?: string;
}

interface KrishiGramGroup {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  cover_image_url?: string;
  members_count: number;
  is_private: boolean;
  isMember?: boolean;
}

const KrishiGramComponent = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'create' | 'groups' | 'my-posts'>('feed');
  const [posts, setPosts] = useState<KrishiGramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [locationText, setLocationText] = useState('');
  const [groups, setGroups] = useState<KrishiGramGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [comments, setComments] = useState<{[key: string]: KrishiGramComment[]}>({});
  const [commentsLoading, setCommentsLoading] = useState<{[key: string]: boolean}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [postType, setPostType] = useState<'post' | 'reel' | 'story'>('post');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefGroup = useRef<HTMLInputElement>(null);
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null);
  const [groupImagePreview, setGroupImagePreview] = useState<string | null>(null);
  const [isPrivateGroup, setIsPrivateGroup] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Get user on component mount and load data
  useEffect(() => {
    async function loadInitialData() {
      try {
      const user = await getCurrentUser();
      setUser(user);
        
        await loadPosts();
        await loadGroups();
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load data');
      }
    }
    
    loadInitialData();
  }, []);

  // Load posts from API
  const loadPosts = async (reset = true) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const result = await getKrishiGramPosts(currentPage, 10);
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.data) {
        if (reset) {
          setPosts(result.data);
        } else {
          setPosts(prev => [...prev, ...result.data]);
        }
        
        setHasMore(result.data.length === 10);
        if (reset) {
          setPage(1);
        } else {
          setPage(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
    setLoading(false);
    }
  };
  
  // Load more posts on scroll
  const loadMorePosts = async () => {
    if (!hasMore || loading) return;
    await loadPosts(false);
  };
  
  // Load groups from API
  const loadGroups = async () => {
    try {
      setGroupsLoading(true);
      const result = await getKrishiGramGroups();
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.data) {
        setGroups(result.data);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setGroupsLoading(false);
    }
  };
  
  // Handle file selection for media upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is image or video
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select an image or video file');
      return;
    }
    
    setMediaFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle group image selection
  const handleGroupImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file for group cover');
      return;
    }
    
    setGroupImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setGroupImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Create a new post
  const handleCreatePost = async () => {
    if (!content && !mediaFile) {
      toast.error('Please add some content or media to your post');
      return;
    }
    
    setUploading(true);
    
    try {
      const supabase = createClient();
      let mediaUrl = '';
      let mediaType = '';
      
      // Upload media file if exists
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('krishigram')
          .upload(filePath, mediaFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('krishigram')
          .getPublicUrl(filePath);
        
        mediaUrl = urlData.publicUrl;
      }
      
      // Extract tags from content
      const tags = content.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];
      
      // Create post in database
      const result = await createKrishiGramPost(
          content,
        mediaUrl,
        mediaType,
        locationText,
        postType,
        tags
      );
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.data) {
        // Reset form
        setContent('');
        setMediaFile(null);
        setPreviewUrl(null);
        setLocationText('');
        setPostType('post');
        setUploading(false);
        
        // Refresh posts
        loadPosts();
        
        // Switch to feed tab
        setActiveTab('feed');
        
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast.success('Post created successfully!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      setUploading(false);
    }
  };
  
  // Toggle like on a post
  const handleLikePost = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        const result = await unlikeKrishiGramPost(postId);
        if (result.error) {
          throw result.error;
        }
      } else {
        const result = await likeKrishiGramPost(postId);
        if (result.error) {
          throw result.error;
        }
      }
      
      // Update posts state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !isLiked
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    }
  };
  
  // Load comments for a post
  const loadComments = async (postId: string) => {
    try {
      if (commentsLoading[postId]) return;
      
      setCommentsLoading(prev => ({ ...prev, [postId]: true }));
      
      const result = await getKrishiGramComments(postId);
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.data) {
        setComments(prev => ({ ...prev, [postId]: result.data }));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setCommentsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };
  
  // Toggle comments visibility
  const toggleComments = async (postId: string) => {
    // If comments are not yet loaded, load them
    if (!comments[postId]) {
      await loadComments(postId);
    }
    
    setShowComments(prev => ({ 
      ...prev, 
      [postId]: !prev[postId] 
    }));
    
    if (!showComments[postId]) {
      setActivePostId(postId);
    } else {
      setActivePostId(null);
    }
  };
  
  // Add a comment to a post
  const handleAddComment = async (postId: string) => {
    if (!commentContent.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    try {
      const result = await commentOnKrishiGramPost(postId, commentContent);
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.data) {
        // Update comments state
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), result.data]
        }));
        
        // Update post comment count
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments_count: post.comments_count + 1
            };
          }
          return post;
        }));
        
        // Reset comment input
        setCommentContent('');
        
        toast.success('Comment added!');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };
  
  // Join a group
  const handleJoinGroup = async (groupId: string) => {
    try {
      const result = await joinKrishiGramGroup(groupId);
      
      if (result.error) {
        throw result.error;
      }
      
      // Update groups state
      setGroups(groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            members_count: group.members_count + 1,
            isMember: true
          };
        }
        return group;
      }));
      
      toast.success('Joined group successfully!');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    }
  };
  
  // Create a new group
  const handleCreateGroup = async () => {
    if (!newGroupName) {
      toast.error('Please enter a group name');
      return;
    }
    
    setCreatingGroup(true);
    
    try {
      const supabase = createClient();
      let coverImageUrl = '';
      
      // Upload group cover image if exists
      if (groupImageFile) {
        const fileExt = groupImageFile.name.split('.').pop();
        const fileName = `group-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `groups/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('krishigram')
          .upload(filePath, groupImageFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('krishigram')
          .getPublicUrl(filePath);
        
        coverImageUrl = urlData.publicUrl;
      }
      
      // Create group in database
      const { data, error } = await supabase
        .from('krishigram_groups')
        .insert({
          name: newGroupName,
          description: newGroupDescription,
          created_by: user.id,
          cover_image_url: coverImageUrl || null,
          is_private: isPrivateGroup,
          members_count: 1 // Creator is the first member
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        try {
          // Add creator as member with admin role
          await supabase
            .from('krishigram_group_members')
            .insert({
              group_id: data.id,
              user_id: user.id,
              role: 'admin'
            });
          
          // Reset form
          setNewGroupName('');
          setNewGroupDescription('');
          setGroupImageFile(null);
          setGroupImagePreview(null);
          setIsPrivateGroup(false);
          setShowCreateGroup(false);
          
          // Refresh groups
          await loadGroups();
          
          toast.success('Group created successfully!');
        } catch (memberError) {
          console.error('Error adding creator as admin:', memberError);
          toast.error('Group created but failed to add you as a member');
        }
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setCreatingGroup(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* KrishiGram Header */}
      <div className="border-b border-gray-200 p-4 sticky top-0 z-10 bg-white backdrop-blur-sm bg-opacity-95">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-2xl font-bold text-green-800 flex items-center">
            <span className="text-3xl mr-2">🌱</span> KrishiGram
          </h2>
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'feed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Feed
              </span>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'explore' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              Explore
              </span>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'create' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              Create
              </span>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('groups')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'groups' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              Groups
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4">
        <AnimatePresence mode="wait">
        {activeTab === 'feed' && (
            <motion.div 
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading && posts.length === 0 ? (
              <div className="text-center p-8">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mb-3"></div>
                <p>Loading posts...</p>
              </div>
            ) : (
                <>
                  {posts.map((post) => (
                    <motion.div 
                      key={post.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                  {/* Post Header */}
                  <div className="p-4 flex items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold overflow-hidden">
                      {post.user_avatar_url ? (
                            <img src={post.user_avatar_url} alt={post.user_full_name} className="w-full h-full object-cover" />
                      ) : (
                        post.user_full_name.charAt(0)
                      )}
                    </div>
                        <div className="ml-3 flex-grow">
                          <div className="font-semibold text-gray-800">{post.user_full_name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                            {post.location && (
                              <>
                                <span className="mx-1">•</span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {post.location}
                                </span>
                              </>
                            )}
                      </div>
                    </div>
                        <div className="text-gray-400">
                          <button className="hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="px-4 pb-2">
                    <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags?.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs hover:bg-green-100 cursor-pointer transition-colors">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Post Media */}
                  {post.media_url && (
                    <div className="mt-2">
                          {post.media_type === 'video' || post.type === 'reel' ? (
                            <div className="relative bg-black">
                          <video 
                            src={post.media_url} 
                                className="w-full max-h-[500px] object-contain mx-auto" 
                            controls
                          />
                              {post.type === 'reel' && (
                          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                            Reel
                          </div>
                              )}
                        </div>
                      ) : (
                        <img 
                          src={post.media_url} 
                          alt={`Post by ${post.user_full_name}`} 
                          className="w-full max-h-[500px] object-cover"
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Post Actions */}
                  <div className="p-4 flex items-center justify-between border-t border-gray-100">
                    <div className="flex space-x-4">
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center ${
                              post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                            }`}
                            onClick={() => handleLikePost(post.id, post.isLiked || false)}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-6 w-6 mr-1" 
                              fill={post.isLiked ? "currentColor" : "none"} 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={post.isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{post.likes}</span>
                          </motion.button>
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center text-gray-600 hover:text-blue-500"
                            onClick={() => toggleComments(post.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span>{post.comments_count}</span>
                          </motion.button>
                    </div>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-600 hover:text-green-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                        </motion.button>
                      </div>
                      
                      {/* Comments Section */}
                      <AnimatePresence>
                        {showComments[post.id] && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-100 bg-gray-50"
                          >
                            <div className="p-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                              
                              {/* Comment List */}
                              <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
                                {commentsLoading[post.id] ? (
                                  <div className="text-center py-2">
                                    <div className="inline-block w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                ) : comments[post.id]?.length ? (
                                  comments[post.id].map(comment => (
                                    <div key={comment.id} className="flex items-start space-x-2">
                                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs overflow-hidden">
                                        {comment.user_avatar_url ? (
                                          <img src={comment.user_avatar_url} alt={comment.user_full_name} className="w-full h-full object-cover" />
                                        ) : (
                                          comment.user_full_name.charAt(0)
                                        )}
                                      </div>
                                      <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium text-sm text-gray-800">{comment.user_full_name}</span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric'
                                            })}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
                                ) : (
                                  <p className="text-sm text-gray-500 text-center py-2">No comments yet. Be the first to comment!</p>
            )}
          </div>
                              
                              {/* Add Comment Form */}
                              <div className="flex space-x-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs overflow-hidden">
                                  {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-full h-full object-cover" />
                                  ) : (
                                    user?.user_metadata?.full_name?.charAt(0) || 'U'
                                  )}
                                </div>
                                <div className="flex-1 flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={activePostId === post.id ? commentContent : ''}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddComment(post.id);
                                      }
                                    }}
                                  />
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAddComment(post.id)}
                                    className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-700"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                  
                  {/* Load More Button */}
                  {posts.length > 0 && hasMore && (
                    <div className="text-center mt-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={loadMorePosts}
                        disabled={loading}
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-4 w-4 mr-2 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                          </span>
                        ) : (
                          'Load More Posts'
                        )}
                      </motion.button>
                    </div>
                  )}
                  
                  {posts.length === 0 && !loading && (
                    <div className="text-center py-8 bg-green-50 rounded-xl">
                      <div className="text-5xl mb-3">🌱</div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No posts yet</h3>
                      <p className="text-gray-600 mb-4">Be the first to share your farming knowledge!</p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('create')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Create a Post
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
        )}

        {activeTab === 'create' && (
            <motion.div 
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Create New Post</h3>
                
                {/* Post Type Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPostType('post')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        postType === 'post'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Post
                      </span>
                    </button>
                    <button
                      onClick={() => setPostType('reel')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        postType === 'reel'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Reel
                      </span>
                    </button>
                    <button
                      onClick={() => setPostType('story')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        postType === 'story'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Story
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="mb-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                  </label>
              <textarea
                    id="content"
                    placeholder="Share your farming knowledge, ask a question, or tell a story..."
                    className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
                  <p className="mt-1 text-xs text-gray-500">Use # to add tags (e.g. #OrganicFarming)</p>
            </div>
            
                {/* Media Preview */}
            {previewUrl && (
                  <div className="mb-6 relative">
                    <div className="rounded-lg overflow-hidden bg-gray-100">
                {mediaFile?.type.startsWith('video/') ? (
                        <video src={previewUrl} className="max-h-[400px] w-full object-contain" controls />
                ) : (
                        <img src={previewUrl} alt="Preview" className="max-h-[400px] w-full object-cover" />
                )}
                    </div>
                <button 
                  onClick={() => {
                    setMediaFile(null);
                    setPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
                {/* Location Input */}
                <div className="mb-6">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="location"
                      placeholder="Add your location"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                      {mediaFile ? 'Change Media' : 'Add Media'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                onClick={handleCreatePost}
                disabled={uploading || (!content && !mediaFile)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  uploading || (!content && !mediaFile)
                    ? 'bg-green-300 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                    {uploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </span>
                    ) : (
                      'Share Post'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'groups' && (
            <motion.div 
              key="groups"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Your Farming Groups</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateGroup(!showCreateGroup)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                >
                  {showCreateGroup ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Group
                    </>
                  )}
                </motion.button>
              </div>
              
              {/* Create Group Form */}
              <AnimatePresence>
                {showCreateGroup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mb-6"
                  >
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Create a New Farming Group</h4>
                    
                    <div className="space-y-4">
                      {/* Group Name */}
                      <div>
                        <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1">
                          Group Name*
                        </label>
                        <input
                          type="text"
                          id="group-name"
                          placeholder="e.g. Organic Wheat Farmers"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          required
                        />
                      </div>
                      
                      {/* Group Description */}
                      <div>
                        <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="group-description"
                          placeholder="What is this group about?"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          rows={3}
                          value={newGroupDescription}
                          onChange={(e) => setNewGroupDescription(e.target.value)}
                        />
                      </div>
                      
                      {/* Group Cover Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cover Image
                        </label>
                        
                        {groupImagePreview ? (
                          <div className="relative mb-2">
                            <img 
                              src={groupImagePreview} 
                              alt="Group cover preview" 
                              className="w-full h-40 object-cover rounded-lg" 
                            />
                            <button
                              onClick={() => {
                                setGroupImageFile(null);
                                setGroupImagePreview(null);
                                if (fileInputRefGroup.current) fileInputRefGroup.current.value = '';
                              }}
                              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
              </button>
            </div>
                        ) : (
                          <div 
                            onClick={() => fileInputRefGroup.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 cursor-pointer transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-1 text-sm text-gray-600">Click to upload group cover image</p>
          </div>
        )}

                        <input
                          type="file"
                          ref={fileInputRefGroup}
                          accept="image/*"
                          onChange={handleGroupImageSelect}
                          className="hidden"
                        />
                      </div>
                      
                      {/* Privacy Setting */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="is-private"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          checked={isPrivateGroup}
                          onChange={(e) => setIsPrivateGroup(e.target.checked)}
                        />
                        <label htmlFor="is-private" className="ml-2 block text-sm text-gray-700">
                          Make this group private (only members can see content)
                        </label>
                      </div>
                      
                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCreateGroup}
                          disabled={creatingGroup || !newGroupName.trim()}
                          className={`px-6 py-2 rounded-lg font-medium ${
                            creatingGroup || !newGroupName.trim()
                              ? 'bg-green-300 text-white cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {creatingGroup ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                              Creating...
                            </span>
                          ) : (
                            'Create Group'
                          )}
                        </motion.button>
                        </div>
                      </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Group List */}
              {groupsLoading ? (
                <div className="text-center p-8">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mb-3"></div>
                  <p>Loading groups...</p>
                </div>
              ) : groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groups.map(group => (
                    <motion.div 
                      key={group.id}
                      whileHover={{ translateY: -5 }}
                      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white"
                    >
                      <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-500 relative">
                        {group.cover_image_url && (
                          <img 
                            src={group.cover_image_url} 
                            alt={group.name} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                        {group.is_private && (
                          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Private
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-lg text-gray-800 mb-1">{group.name}</h4>
                        <p className="text-sm text-gray-500 mb-3">
                          {group.members_count} {group.members_count === 1 ? 'member' : 'members'}
                        </p>
                        {group.description && (
                          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{group.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Created {new Date(group.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {group.isMember ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Member
                            </span>
                          ) : (
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleJoinGroup(group.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700"
                            >
                              Join
                            </motion.button>
                  )}
                </div>
                      </div>
                    </motion.div>
              ))}
            </div>
              ) : (
                <div className="text-center py-8 bg-green-50 rounded-xl">
                  <div className="text-5xl mb-3">👨‍🌾</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No groups found</h3>
                  <p className="text-gray-600 mb-4">Create a new group to connect with other farmers!</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateGroup(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create a Group
                  </motion.button>
          </div>
        )}

              {/* Featured Groups */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Featured Groups</h4>
            <div className="space-y-3">
                  <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer bg-white">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    🌾
                  </div>
                  <div>
                        <h5 className="font-medium text-gray-800">Organic Farming Collective</h5>
                    <p className="text-sm text-gray-500">268 members • 12 new posts</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">A community dedicated to organic farming practices and sustainable agriculture.</p>
              </div>
              
                  <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer bg-white">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    🌱
                  </div>
                  <div>
                        <h5 className="font-medium text-gray-800">Gujarat Rice Growers</h5>
                    <p className="text-sm text-gray-500">142 members • 5 new posts</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Regional group for rice farmers in Gujarat to share knowledge and best practices.</p>
              </div>
              
                  <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer bg-white">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                    🔍
                  </div>
                  <div>
                        <h5 className="font-medium text-gray-800">Pest Management Experts</h5>
                    <p className="text-sm text-gray-500">89 members • 2 new posts</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Forum for discussing natural and chemical pest management solutions.</p>
              </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Add Explore tab */}
          
          {activeTab === 'explore' && (
            <motion.div 
              key="explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Explore Popular Posts</h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
                    <input
                      type="text"
                      placeholder="Search posts, tags, users..."
                      className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Popular Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-sm text-gray-600">Popular Tags:</span>
                  {['OrganicFarming', 'Sustainability', 'SoilHealth', 'PestControl', 'Rice', 'Wheat', 'ClimateAction'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 cursor-pointer transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Grid of Posts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                  {posts.map(post => (
                    <motion.div 
                      key={post.id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer aspect-square"
                    >
                      {post.media_url ? (
                        post.media_type === 'video' || post.type === 'reel' ? (
                          <div className="relative w-full h-full">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <img src={post.media_url} alt={post.content} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <img src={post.media_url} alt={post.content} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 p-4">
                          <p className="text-white text-center font-medium line-clamp-4">{post.content}</p>
          </div>
        )}
                      
                      {/* Overlay with post info */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <span className="text-white text-sm font-medium truncate">{post.user_full_name}</span>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center text-white text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post.likes}
                          </div>
                          <div className="flex items-center text-white text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {post.comments_count}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Trending Farmers to Follow */}
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Trending Farmers to Follow</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: '1', name: 'Rajesh Patel', avatar: '/images/avatars/user1.jpg', location: 'Gujarat', followers: 245, specialty: 'Organic Rice Farming' },
                    { id: '2', name: 'Priya Singh', avatar: '/images/avatars/user2.jpg', location: 'Rajasthan', followers: 189, specialty: 'Natural Pest Control' },
                    { id: '3', name: 'Arjun Mehta', avatar: '', location: 'Maharashtra', followers: 156, specialty: 'Soil Health Management' }
                  ].map(farmer => (
                    <motion.div
                      key={farmer.id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl overflow-hidden">
                          {farmer.avatar ? (
                            <img src={farmer.avatar} alt={farmer.name} className="w-full h-full object-cover" />
                          ) : (
                            farmer.name.charAt(0)
                          )}
                        </div>
                        <div className="ml-4">
                          <h5 className="font-semibold text-gray-800">{farmer.name}</h5>
                          <p className="text-sm text-gray-500">{farmer.location}</p>
                          <p className="text-xs text-gray-500 mt-1">{farmer.followers} followers</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Specialty:</span> {farmer.specialty}
                        </p>
                      </div>
                      <div className="mt-4">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                          Follow
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KrishiGramComponent; 