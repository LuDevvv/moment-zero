CREATE TABLE `Moment` (
	`id` text PRIMARY KEY NOT NULL,
	`theme` text DEFAULT 'dark-void' NOT NULL,
	`atmosphere` text DEFAULT 'void' NOT NULL,
	`typography` text DEFAULT 'serif' NOT NULL,
	`message` text,
	`targetYear` integer DEFAULT 2026 NOT NULL,
	`isPublic` integer DEFAULT true NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Moment_userId_idx` ON `Moment` (`userId`);--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`name` text,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_username_unique` ON `User` (`username`);--> statement-breakpoint
CREATE INDEX `User_username_idx` ON `User` (`username`);