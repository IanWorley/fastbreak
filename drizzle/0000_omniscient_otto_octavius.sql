CREATE TABLE `fastbreak_game` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`team_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fastbreak_player` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`team_id` text(26) NOT NULL,
	`archived` integer DEFAULT false NOT NULL,
	`jersey_number` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fastbreak_shot` (
	`id` text(25) PRIMARY KEY NOT NULL,
	`player_id` text(25) NOT NULL,
	`game_id` text(25) NOT NULL,
	`points` integer NOT NULL,
	`quarter` integer NOT NULL,
	`made` integer DEFAULT true NOT NULL,
	`team_id` text(25) NOT NULL,
	`x_point` integer NOT NULL,
	`y_point` integer NOT NULL,
	`is_free_throw` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fastbreak_team` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`user_id` text NOT NULL
);
