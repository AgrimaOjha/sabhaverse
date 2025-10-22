const prisma = require('../utils/prisma');

// Get all posts with pagination
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sortBy = 'createdAt', order = 'desc' } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    const where = category ? { category } : {};
    
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        [sortBy]: order
      },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.post.count({ where });
    
    res.json({
      posts,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            reputation: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    const authorId = req.user.id;
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        imageUrl,
        author: {
          connect: { id: authorId }
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      }
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, imageUrl } = req.body;
    const userId = req.user.id;
    
    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (existingPost.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        category,
        imageUrl
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      }
    });
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (existingPost.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    // Delete all comments first
    await prisma.comment.deleteMany({
      where: { postId: id }
    });
    
    // Delete the post
    await prisma.post.delete({
      where: { id }
    });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upvote a post
exports.upvotePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.post.findUnique({
      where: { id },
      select: { upvotes: true, authorId: true }
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        upvotes: post.upvotes + 1
      }
    });
    
    // Increase author's reputation
    await prisma.user.update({
      where: { id: post.authorId },
      data: {
        reputation: {
          increment: 1
        }
      }
    });
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Upvote post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};