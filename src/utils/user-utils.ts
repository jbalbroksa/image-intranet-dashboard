
/**
 * Utility functions for user-related operations
 */

/**
 * Validates if a string is a valid UUID
 * @param id The string to validate
 * @returns boolean indicating if the string is a valid UUID
 */
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Maps user data from database format to application format
 * @param dbUser User data from database
 * @returns User object in application format
 */
export const mapDbUserToUser = (dbUser: any) => {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    type: dbUser.type,
    avatar: dbUser.avatar,
    branchId: dbUser.branch_id,
    position: dbUser.position,
    extension: dbUser.extension,
    socialContact: dbUser.social_contact,
    createdAt: dbUser.created_at
  };
};

/**
 * Maps user data from application format to database format
 * @param userData User data in application format
 * @returns Object with user data in database format
 */
export const mapUserToDbUser = (userData: Record<string, any>) => {
  const dbData: Record<string, any> = {};
  
  if (userData.name) dbData.name = userData.name;
  if (userData.email) dbData.email = userData.email;
  if (userData.role) dbData.role = userData.role;
  if (userData.type) dbData.type = userData.type;
  if (userData.avatar !== undefined) dbData.avatar = userData.avatar;
  if (userData.branchId !== undefined) dbData.branch_id = userData.branchId;
  if (userData.position !== undefined) dbData.position = userData.position;
  if (userData.extension !== undefined) dbData.extension = userData.extension;
  if (userData.socialContact !== undefined) dbData.social_contact = userData.socialContact;
  
  return dbData;
};
