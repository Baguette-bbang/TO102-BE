import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1724797116185 implements MigrationInterface {
    name = 'InitialMigration1724797116185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_oauth" ("user_oauth_id" SERIAL NOT NULL, "oauth_provider" character varying NOT NULL, "oauth_id" character varying NOT NULL, "refresh_token" character varying, "refresh_token_expires_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_88502b0e6c04c4449fb622de1f9" UNIQUE ("oauth_provider", "oauth_id"), CONSTRAINT "PK_90f8fc02d6034185297154f436c" PRIMARY KEY ("user_oauth_id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("tag_id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_e9fe36a7c01af44f6c47f972f0b" PRIMARY KEY ("tag_id"))`);
        await queryRunner.query(`CREATE TABLE "post_tag" ("post_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_c6d49aa86322a6f58c39ea25a5d" PRIMARY KEY ("post_id", "tag_id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("post_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "location_id" integer NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "thumbnail" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying(50) NOT NULL, "meeting_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d093caee4d33b2745c7d05a41d" PRIMARY KEY ("post_id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("location_id" SERIAL NOT NULL, "province" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, CONSTRAINT "PK_b6e6c23b493859e5875de66c18d" PRIMARY KEY ("location_id"))`);
        await queryRunner.query(`CREATE TABLE "user_location" ("user_id" integer NOT NULL, "location_id" integer NOT NULL, CONSTRAINT "PK_23e0285bff754c09b132abdc87d" PRIMARY KEY ("user_id", "location_id"))`);
        await queryRunner.query(`CREATE TABLE "user_rating" ("user_id" integer NOT NULL, "average_rating" numeric(3,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_e43dc444624c27b2fd55fa8f5f4" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("review_id" SERIAL NOT NULL, "reviewer_id" integer NOT NULL, "reviewed_id" integer NOT NULL, "rating" numeric(2,1) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0106a233019ba9f4ee80aca2958" PRIMARY KEY ("review_id"))`);
        await queryRunner.query(`CREATE TABLE "friend_request" ("request_id" SERIAL NOT NULL, "requester_id" integer NOT NULL, "addressee_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6b2e03a9d181f0a101e8a6f19d4" UNIQUE ("requester_id", "addressee_id"), CONSTRAINT "PK_81fd110f40e09d3fd1b5839a9be" PRIMARY KEY ("request_id"))`);
        await queryRunner.query(`CREATE TABLE "friendship" ("friendship_id" SERIAL NOT NULL, "user_id1" integer NOT NULL, "user_id2" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae03e6aa603e312fae11e65c969" UNIQUE ("user_id1", "user_id2"), CONSTRAINT "PK_624a6afa21396d0ce441c0570f4" PRIMARY KEY ("friendship_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "username" character varying, "nickname" character varying NOT NULL, "email" character varying NOT NULL, "profile_picture_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "last_login" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "user_block" ("block_id" SERIAL NOT NULL, "blocker_id" integer NOT NULL, "blocked_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1b24094a1f4c9c05a1c4bc84813" PRIMARY KEY ("block_id"))`);
        await queryRunner.query(`ALTER TABLE "user_oauth" ADD CONSTRAINT "FK_9f28821085ddc8340da9e3f5517" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_tag" ADD CONSTRAINT "FK_b5ec92f15aaa1e371f2662f6812" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_tag" ADD CONSTRAINT "FK_d2fd5340bb68556fe93650fedc1" FOREIGN KEY ("tag_id") REFERENCES "tag"("tag_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_52378a74ae3724bcab44036645b" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_44126dd48b7b642b0474ba35c34" FOREIGN KEY ("location_id") REFERENCES "location"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_location" ADD CONSTRAINT "FK_84634a7525e249f57586d1fc421" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_location" ADD CONSTRAINT "FK_26a9ca9a9237d81c821481f3ff9" FOREIGN KEY ("location_id") REFERENCES "location"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_rating" ADD CONSTRAINT "FK_e43dc444624c27b2fd55fa8f5f4" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_2f8adca6682f8238c64d767c9d3" FOREIGN KEY ("reviewer_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_3852eadf481f09cbf4836135384" FOREIGN KEY ("reviewed_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_051481804af16428556fe9c9c5c" FOREIGN KEY ("requester_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_5c910d59fb47131f36ebd0bca9f" FOREIGN KEY ("addressee_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_5433da4546390e659ef54328666" FOREIGN KEY ("user_id1") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_8a885bbeeadd6a7e7bcd9966b79" FOREIGN KEY ("user_id2") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_block" ADD CONSTRAINT "FK_855f9a409b693d6e7cadfae8eba" FOREIGN KEY ("blocker_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_block" ADD CONSTRAINT "FK_ed1ed3923f3dc0bbeecf44585a4" FOREIGN KEY ("blocked_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_block" DROP CONSTRAINT "FK_ed1ed3923f3dc0bbeecf44585a4"`);
        await queryRunner.query(`ALTER TABLE "user_block" DROP CONSTRAINT "FK_855f9a409b693d6e7cadfae8eba"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_8a885bbeeadd6a7e7bcd9966b79"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_5433da4546390e659ef54328666"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_5c910d59fb47131f36ebd0bca9f"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_051481804af16428556fe9c9c5c"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_3852eadf481f09cbf4836135384"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2f8adca6682f8238c64d767c9d3"`);
        await queryRunner.query(`ALTER TABLE "user_rating" DROP CONSTRAINT "FK_e43dc444624c27b2fd55fa8f5f4"`);
        await queryRunner.query(`ALTER TABLE "user_location" DROP CONSTRAINT "FK_26a9ca9a9237d81c821481f3ff9"`);
        await queryRunner.query(`ALTER TABLE "user_location" DROP CONSTRAINT "FK_84634a7525e249f57586d1fc421"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_44126dd48b7b642b0474ba35c34"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_52378a74ae3724bcab44036645b"`);
        await queryRunner.query(`ALTER TABLE "post_tag" DROP CONSTRAINT "FK_d2fd5340bb68556fe93650fedc1"`);
        await queryRunner.query(`ALTER TABLE "post_tag" DROP CONSTRAINT "FK_b5ec92f15aaa1e371f2662f6812"`);
        await queryRunner.query(`ALTER TABLE "user_oauth" DROP CONSTRAINT "FK_9f28821085ddc8340da9e3f5517"`);
        await queryRunner.query(`DROP TABLE "user_block"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "friendship"`);
        await queryRunner.query(`DROP TABLE "friend_request"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "user_rating"`);
        await queryRunner.query(`DROP TABLE "user_location"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "post_tag"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "user_oauth"`);
    }

}
