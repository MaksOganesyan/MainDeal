-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `fullName` VARCHAR(255) NULL,
    `avatar` VARCHAR(500) NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(500) NULL,
    `region` VARCHAR(100) NULL,
    `registeredAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `blockedAt` TIMESTAMP(3) NULL,
    `blockReason` TEXT NULL,
    `lastOnline` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_login_key`(`login`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_login_idx`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `companyName` VARCHAR(255) NULL,
    `specializations` LONGTEXT NULL,
    `experience` INTEGER NULL,
    `description` TEXT NULL,
    `website` VARCHAR(500) NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `showContactInfo` BOOLEAN NOT NULL DEFAULT false,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `totalReviews` INTEGER NOT NULL DEFAULT 0,
    `completedDeals` INTEGER NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `model` VARCHAR(255) NULL,
    `year` INTEGER NULL,
    `description` TEXT NULL,
    `images` LONGTEXT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `equipment_profileId_fkey`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `images` LONGTEXT NULL,
    `category` VARCHAR(100) NULL,
    `materials` LONGTEXT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `portfolio_items_profileId_fkey`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `executorId` INTEGER NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `materials` LONGTEXT NULL,
    `specifications` TEXT NULL,
    `drawings` LONGTEXT NULL,
    `budget` DOUBLE NULL,
    `price` DOUBLE NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'RUB',
    `deadline` TIMESTAMP(3) NULL,
    `estimatedTime` INTEGER NULL,
    `status` ENUM('ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTE') NOT NULL DEFAULT 'ACTIVE',
    `location` VARCHAR(255) NULL,
    `isUrgent` BOOLEAN NOT NULL DEFAULT false,
    `attachments` LONGTEXT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` TIMESTAMP(3) NULL,

    INDEX `deals_customerId_idx`(`customerId`),
    INDEX `deals_executorId_idx`(`executorId`),
    INDEX `deals_status_idx`(`status`),
    INDEX `deals_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deal_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dealId` INTEGER NOT NULL,
    `executorId` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `proposedPrice` DOUBLE NULL,
    `estimatedDays` INTEGER NULL,
    `portfolioLinks` LONGTEXT NULL,
    `experience` TEXT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') NOT NULL DEFAULT 'PENDING',
    `rejectionReason` TEXT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `respondedAt` TIMESTAMP(3) NULL,

    INDEX `deal_responses_dealId_idx`(`dealId`),
    INDEX `deal_responses_executorId_idx`(`executorId`),
    INDEX `deal_responses_status_idx`(`status`),
    UNIQUE INDEX `deal_responses_dealId_executorId_key`(`dealId`, `executorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dealId` INTEGER NULL,
    `announcementId` INTEGER NULL,
    `managerId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `chat_rooms_dealId_key`(`dealId`),
    UNIQUE INDEX `chat_rooms_announcementId_key`(`announcementId`),
    INDEX `chat_rooms_managerId_fkey`(`managerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,
    `recipientId` INTEGER NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('TEXT', 'IMAGE', 'FILE', 'SYSTEM', 'AUTO_REPLY') NOT NULL DEFAULT 'TEXT',
    `attachments` LONGTEXT NULL,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `blockReason` TEXT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chat_messages_roomId_idx`(`roomId`),
    INDEX `chat_messages_authorId_idx`(`authorId`),
    INDEX `chat_messages_recipientId_fkey`(`recipientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dealId` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,
    `targetId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `pros` LONGTEXT NULL,
    `cons` LONGTEXT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `reviews_authorId_fkey`(`authorId`),
    INDEX `reviews_dealId_fkey`(`dealId`),
    INDEX `reviews_targetId_fkey`(`targetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `executorId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `priceFrom` DOUBLE NULL,
    `priceTo` DOUBLE NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'RUB',
    `estimatedDays` INTEGER NULL,
    `region` VARCHAR(100) NULL,
    `location` VARCHAR(255) NULL,
    `images` LONGTEXT NULL,
    `attachments` LONGTEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isUrgent` BOOLEAN NOT NULL DEFAULT false,
    `isHidden` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `announcements_category_idx`(`category`),
    INDEX `announcements_region_idx`(`region`),
    INDEX `announcements_isActive_isUrgent_idx`(`isActive`, `isUrgent`),
    INDEX `announcements_executorId_fkey`(`executorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `complaints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorId` INTEGER NOT NULL,
    `targetId` INTEGER NOT NULL,
    `dealId` INTEGER NULL,
    `reason` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `evidence` LONGTEXT NULL,
    `status` ENUM('PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `handlerId` INTEGER NULL,
    `resolution` TEXT NULL,
    `action` ENUM('WARNING', 'TEMPORARY_BAN', 'PERMANENT_BAN', 'ORDER_CANCELLED', 'NO_ACTION') NULL,
    `resolvedAt` TIMESTAMP(3) NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `complaints_status_idx`(`status`),
    INDEX `complaints_targetId_idx`(`targetId`),
    INDEX `complaints_authorId_fkey`(`authorId`),
    INDEX `complaints_dealId_fkey`(`dealId`),
    INDEX `complaints_handlerId_fkey`(`handlerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` ENUM('NEW_MESSAGE', 'NEW_DEAL', 'DEAL_ASSIGNED', 'DEAL_COMPLETED', 'NEW_REVIEW', 'COMPLAINT_CREATED', 'COMPLAINT_RESOLVED', 'SYSTEM') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `relatedId` INTEGER NULL,
    `link` VARCHAR(500) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_isRead_idx`(`userId`, `isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userrole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `role` ENUM('CUSTOMER', 'EXECUTOR', 'MANAGER', 'ADMIN') NOT NULL,

    INDEX `UserRole_userId_idx`(`userId`),
    UNIQUE INDEX `UserRole_userId_role_key`(`userId`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatRoomMembers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `joinedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ChatRoomMembers_roomId_idx`(`roomId`),
    INDEX `ChatRoomMembers_userId_idx`(`userId`),
    UNIQUE INDEX `ChatRoomMembers_roomId_userId_key`(`roomId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcement_listings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'RUB',
    `photos` JSON NULL,
    `status` ENUM('ACTIVE', 'MODERATION', 'BLOCKED', 'COMPLETED') NOT NULL DEFAULT 'MODERATION',
    `city` VARCHAR(100) NULL,
    `address` VARCHAR(500) NULL,
    `deadlineDays` INTEGER NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publishedAt` TIMESTAMP(3) NULL,
    `expiresAt` DATE NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `moderatorId` INTEGER NULL,
    `blockReason` TEXT NULL,
    `moderatedAt` TIMESTAMP(3) NULL,

    INDEX `announcement_listings_user_id_idx`(`userId`),
    INDEX `announcement_listings_status_idx`(`status`),
    INDEX `announcement_listings_city_idx`(`city`),
    INDEX `announcement_listings_created_at_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(50) NOT NULL,
    `announcementId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `executorId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `prepayment` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `paidAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `status` ENUM('AWAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTE') NOT NULL DEFAULT 'AWAITING',
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `confirmedAt` TIMESTAMP(3) NULL,
    `startDate` DATE NULL,
    `deadlineDate` DATE NULL,
    `completedAt` TIMESTAMP(3) NULL,
    `isOverdue` BOOLEAN NOT NULL DEFAULT false,
    `clientReview` TEXT NULL,
    `executorReview` TEXT NULL,
    `clientRating` INTEGER NULL,
    `executorRating` INTEGER NULL,
    `moderatorId` INTEGER NULL,
    `cancelReason` TEXT NULL,
    `adminNotes` TEXT NULL,

    UNIQUE INDEX `orders_orderNumber_key`(`orderNumber`),
    INDEX `orders_client_id_idx`(`clientId`),
    INDEX `orders_executor_id_idx`(`executorId`),
    INDEX `orders_status_idx`(`status`),
    INDEX `orders_created_at_idx`(`createdAt`),
    INDEX `orders_deadline_date_idx`(`deadlineDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `announcementId` INTEGER NOT NULL,
    `executorId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `message` TEXT NULL,
    `proposedPrice` DECIMAL(10, 2) NULL,
    `estimatedDays` INTEGER NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') NOT NULL DEFAULT 'PENDING',
    `selectedAt` TIMESTAMP(3) NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `responses_announcement_id_idx`(`announcementId`),
    INDEX `responses_executor_id_idx`(`executorId`),
    INDEX `responses_client_id_idx`(`clientId`),
    INDEX `responses_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_chatroommembers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_chatroommembers_AB_unique`(`A`, `B`),
    INDEX `_chatroommembers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
