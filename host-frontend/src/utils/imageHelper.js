// FILE: src/utils/imageHelper.js
// PURPOSE: Helper functions for handling image URLs consistently

/**
 * Get full image URL from path
 * @param {string} imagePath - Image path from backend (e.g., "/uploads/image.jpg")
 * @returns {string} Full image URL
 */
// export const getImageURL = (imagePath) => {
//   if (!imagePath) return null;

//   // If already a full URL, return as is
//   if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
//     return imagePath;
//   }

// Get base URL from environment or use production URL
//   const baseURL =
//     import.meta.env.VITE_API_URL ||
//     "https://biswabanglasocialnetworkingservices.com";

//   // Remove leading slash if present
//   const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

//   return `${baseURL}${cleanPath}`;
// };

// /**
//  * Generate avatar URL for user
//  * @param {string} firstName - User's first name
//  * @param {string} lastName - User's last name
//  * @param {number} size - Avatar size in pixels (default: 200)
//  * @returns {string} Avatar URL
//  */
// export const generateAvatar = (firstName, lastName, size = 200) => {
//   const name = `${firstName}+${lastName}`;
//   return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//     name
//   )}&background=random&color=fff&size=${size}`;
// };

// /**
//  * Get profile picture URL with fallback to avatar
//  * @param {string} profilePicture - Profile picture path
//  * @param {string} firstName - User's first name
//  * @param {string} lastName - User's last name
//  * @param {number} size - Avatar size for fallback
//  * @returns {string} Image URL
//  */
// export const getProfilePicture = (
//   profilePicture,
//   firstName,
//   lastName,
//   size = 200
// ) => {
//   if (profilePicture) {
//     return getImageURL(profilePicture);
//   }
//   return generateAvatar(firstName, lastName, size);
// };

// /**
//  * Validate image file before upload
//  * @param {File} file - Image file to validate
//  * @param {number} maxSizeMB - Maximum file size in MB (default: 5)
//  * @returns {Object} { valid: boolean, error: string|null }
//  */
// export const validateImageFile = (file, maxSizeMB = 5) => {
//   if (!file) {
//     return { valid: false, error: "No file selected" };
//   }

//   // Check file type
//   const allowedTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/gif",
//     "image/webp",
//   ];
//   if (!allowedTypes.includes(file.type)) {
//     return {
//       valid: false,
//       error: "Only JPEG, PNG, GIF, and WebP images are allowed",
//     };
//   }

//   // Check file size
//   const maxSize = maxSizeMB * 1024 * 1024;
//   if (file.size > maxSize) {
//     return {
//       valid: false,
//       error: `File size must be less than ${maxSizeMB}MB`,
//     };
//   }

//   return { valid: true, error: null };
// };

// /**
//  * Create image preview from file
//  * @param {File} file - Image file
//  * @returns {Promise<string>} Data URL for preview
//  */
// export const createImagePreview = (file) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject(new Error("No file provided"));
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => resolve(e.target.result);
//     reader.onerror = (e) => reject(new Error("Failed to read file"));
//     reader.readAsDataURL(file);
//   });
// };
// FILE: src/utils/imageHelper.js

/**
 * Get base URL for API/uploads
 */
export const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_API_URL ||
      "https://biswabanglasocialnetworkingservices.com"
    );
  }
  return import.meta.env.VITE_API_URL || "http://localhost:3001";
};

/**
 * Get full URL for uploaded file (images/videos)
 */
export const getFileURL = (filePath) => {
  if (!filePath) return null;

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  const baseURL = getBaseURL();
  const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;

  return `${baseURL}${cleanPath}`;
};

/**
 * Generate avatar URL
 */
export const generateAvatar = (firstName, lastName, size = 200) => {
  const name = `${firstName}+${lastName}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&color=fff&size=${size}`;
};

/**
 * Get profile picture with fallback
 */
export const getProfilePicture = (profilePicture, firstName, lastName) => {
  if (profilePicture) {
    return getFileURL(profilePicture);
  }
  return generateAvatar(firstName, lastName);
};

/**
 * Validate image file
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, GIF, and WebP images are allowed",
    };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Create image preview
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
