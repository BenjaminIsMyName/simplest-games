import math
import random

import pygame


pygame.init()
AUDIO_ENABLED = True
try:
    pygame.mixer.init()
except pygame.error:
    AUDIO_ENABLED = False

WIDTH, HEIGHT = 1100, 780
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Neon Invaders")

BLACK = (8, 10, 24)
MIDNIGHT = (12, 18, 40)
WHITE = (245, 248, 255)
NEON_BLUE = (48, 232, 255)
NEON_PINK = (255, 84, 221)
NEON_GREEN = (90, 255, 120)
NEON_YELLOW = (255, 224, 77)
NEON_RED = (255, 92, 92)
PURPLE = (123, 92, 255)
ORANGE = (255, 160, 64)
SKY = (109, 215, 255)

FPS = 60
clock = pygame.time.Clock()

try:
    font_small = pygame.font.SysFont("consolas", 20)
    font_main = pygame.font.SysFont("impact", 34)
    font_big = pygame.font.SysFont("impact", 88)
except Exception:
    font_small = pygame.font.SysFont(None, 20)
    font_main = pygame.font.SysFont(None, 34)
    font_big = pygame.font.SysFont(None, 88)


def generate_sound(frequency, duration, volume=0.08):
    if not AUDIO_ENABLED:
        return None
    try:
        sample_rate = 44100
        sample_count = int(sample_rate * duration)
        buffer = bytearray()
        for i in range(sample_count):
            value = int(volume * 32767.0 * math.sin(2.0 * math.pi * frequency * i / sample_rate))
            buffer.extend(value.to_bytes(2, byteorder="little", signed=True))
        return pygame.mixer.Sound(buffer=buffer)
    except Exception:
        return None


sound_player_shoot = generate_sound(1250, 0.05, 0.03)
sound_enemy_shoot = generate_sound(320, 0.07, 0.04)
sound_hit = generate_sound(180, 0.12, 0.07)
sound_explode = generate_sound(110, 0.20, 0.08)
sound_pickup = generate_sound(1750, 0.09, 0.04)
sound_boss = generate_sound(80, 0.25, 0.08)


def create_glow_surf(surf, radius, color):
    glow = pygame.Surface((surf.get_width() + radius * 2, surf.get_height() + radius * 2), pygame.SRCALPHA)
    for i in range(radius, 0, -2):
        alpha = int(70 * (1 - i / radius))
        pygame.draw.ellipse(
            glow,
            (*color, alpha),
            (radius - i, radius - i, surf.get_width() + i * 2, surf.get_height() + i * 2),
        )
    glow.blit(surf, (radius, radius))
    return glow


def create_player_img():
    surf = pygame.Surface((72, 62), pygame.SRCALPHA)
    wings = [(6, 32), (28, 18), (36, 22), (44, 18), (66, 32), (52, 56), (36, 46), (20, 56)]
    cockpit = [(36, 8), (50, 28), (36, 40), (22, 28)]
    pygame.draw.polygon(surf, SKY, wings)
    pygame.draw.polygon(surf, WHITE, wings, 2)
    pygame.draw.polygon(surf, NEON_BLUE, [(14, 34), (36, 0), (58, 34), (36, 54)])
    pygame.draw.polygon(surf, WHITE, [(14, 34), (36, 0), (58, 34), (36, 54)], 2)
    pygame.draw.polygon(surf, NEON_PINK, cockpit)
    pygame.draw.rect(surf, ORANGE, (18, 42, 10, 10), border_radius=4)
    pygame.draw.rect(surf, ORANGE, (44, 42, 10, 10), border_radius=4)
    return create_glow_surf(surf, 10, NEON_BLUE)


def create_enemy_img(color, variant=0):
    surf = pygame.Surface((64, 54), pygame.SRCALPHA)
    if variant == 0:
        points = [(8, 16), (18, 4), (30, 14), (34, 8), (46, 14), (56, 4), (56, 28), (48, 48), (16, 48), (8, 28)]
        pygame.draw.polygon(surf, color, points)
        pygame.draw.polygon(surf, WHITE, points, 2)
        pygame.draw.polygon(surf, NEON_YELLOW, [(29, 22), (35, 22), (32, 30)])
        pygame.draw.circle(surf, WHITE, (24, 24), 5)
        pygame.draw.circle(surf, WHITE, (40, 24), 5)
        pygame.draw.circle(surf, BLACK, (24, 24), 2)
        pygame.draw.circle(surf, BLACK, (40, 24), 2)
        pygame.draw.arc(surf, WHITE, (18, 28, 28, 14), math.pi * 0.1, math.pi * 0.9, 2)
    else:
        points = [(10, 10), (54, 10), (62, 24), (50, 48), (14, 48), (2, 24)]
        pygame.draw.polygon(surf, color, points)
        pygame.draw.polygon(surf, WHITE, points, 2)
        pygame.draw.polygon(surf, PURPLE, [(16, 18), (48, 18), (54, 30), (10, 30)])
        pygame.draw.circle(surf, WHITE, (24, 26), 4)
        pygame.draw.circle(surf, WHITE, (40, 26), 4)
        pygame.draw.rect(surf, NEON_RED, (25, 36, 14, 5), border_radius=2)
    return create_glow_surf(surf, 8, color)


def create_boss_img():
    surf = pygame.Surface((190, 132), pygame.SRCALPHA)
    hull = [(18, 24), (172, 24), (186, 46), (150, 116), (40, 116), (4, 46)]
    pygame.draw.polygon(surf, PURPLE, hull)
    pygame.draw.polygon(surf, WHITE, hull, 3)
    pygame.draw.rect(surf, NEON_PINK, (38, 42, 114, 28), border_radius=10)
    pygame.draw.circle(surf, NEON_RED, (56, 84), 12)
    pygame.draw.circle(surf, NEON_RED, (132, 84), 12)
    pygame.draw.circle(surf, NEON_YELLOW, (94, 82), 18)
    pygame.draw.circle(surf, WHITE, (94, 82), 18, 3)
    pygame.draw.polygon(surf, NEON_RED, [(24, 32), (42, 8), (56, 32)])
    pygame.draw.polygon(surf, NEON_RED, [(132, 32), (146, 8), (164, 32)])
    return create_glow_surf(surf, 14, PURPLE)


def create_powerup_img(kind):
    surf = pygame.Surface((38, 38), pygame.SRCALPHA)
    color = NEON_YELLOW if kind == "spread" else NEON_GREEN
    pygame.draw.circle(surf, color, (19, 19), 18)
    pygame.draw.circle(surf, WHITE, (19, 19), 18, 2)
    label = "S" if kind == "spread" else "L"
    text = font_small.render(label, True, BLACK)
    surf.blit(text, text.get_rect(center=(19, 19)))
    return create_glow_surf(surf, 8, color)


img_player = create_player_img()
img_enemy_a = create_enemy_img(NEON_PINK, 0)
img_enemy_b = create_enemy_img(NEON_GREEN, 1)
img_boss = create_boss_img()
img_powerup_spread = create_powerup_img("spread")
img_powerup_life = create_powerup_img("life")


class Star:
    def __init__(self):
        self.reset()
        self.y = random.uniform(0, HEIGHT)

    def reset(self):
        self.x = random.uniform(0, WIDTH)
        self.y = random.uniform(-HEIGHT, 0)
        self.depth = random.randint(1, 4)
        self.speed = 1.2 + self.depth * 0.9
        shade = 120 + self.depth * 30
        self.color = (shade, shade, min(255, shade + 40))

    def update(self, speed_bonus=0):
        self.y += self.speed + speed_bonus
        if self.y > HEIGHT:
            self.reset()

    def draw(self, offset_x=0, offset_y=0):
        pygame.draw.circle(screen, self.color, (int(self.x + offset_x), int(self.y + offset_y)), self.depth)


class Particle:
    def __init__(self, x, y, color, speed_range=(2, 9), size_range=(3, 10)):
        self.x = x
        self.y = y
        angle = random.uniform(0, math.pi * 2)
        speed = random.uniform(*speed_range)
        self.dx = math.cos(angle) * speed
        self.dy = math.sin(angle) * speed
        self.color = color
        self.size = random.uniform(*size_range)
        self.life = 1.0
        self.decay = random.uniform(0.02, 0.05)

    def update(self):
        self.x += self.dx
        self.y += self.dy
        self.dx *= 0.97
        self.dy *= 0.97
        self.life -= self.decay
        self.size *= 0.97

    def draw(self, surface):
        if self.life <= 0:
            return
        alpha = max(0, min(255, int(self.life * 255)))
        glow = pygame.Surface((int(self.size * 4), int(self.size * 4)), pygame.SRCALPHA)
        pygame.draw.circle(
            glow,
            (*self.color, alpha // 5),
            (glow.get_width() // 2, glow.get_height() // 2),
            max(2, int(self.size * 1.8)),
        )
        surface.blit(glow, (self.x - glow.get_width() / 2, self.y - glow.get_height() / 2), special_flags=pygame.BLEND_RGBA_ADD)
        pygame.draw.circle(surface, (*WHITE, alpha), (int(self.x), int(self.y)), max(1, int(self.size)))


class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y, speed, color, owner="player", size=(8, 26)):
        super().__init__()
        base = pygame.Surface(size, pygame.SRCALPHA)
        pygame.draw.rect(base, color, (0, 0, size[0], size[1]), border_radius=5)
        inner_height = max(8, size[1] - 10)
        pygame.draw.rect(base, WHITE, (2, 4, max(2, size[0] - 4), inner_height), border_radius=4)
        self.image = create_glow_surf(base, 4, color)
        self.rect = self.image.get_rect(center=(x, y))
        self.speed = speed
        self.owner = owner
        self.radius = max(4, size[0] // 2)

    def update(self):
        self.rect.y += self.speed
        if self.rect.bottom < -40 or self.rect.top > HEIGHT + 40:
            self.kill()


class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.base_image = img_player
        self.image = self.base_image
        self.rect = self.image.get_rect(center=(WIDTH // 2, HEIGHT - 90))
        self.radius = 18
        self.speed = 8
        self.last_shot = 0
        self.shoot_delay = 180
        self.spread_level = 1
        self.lives = 3
        self.invulnerable_until = 0
        self.tilt = 0
        self.engine_phase = random.uniform(0, math.tau)

    def reset_for_run(self):
        self.rect.center = (WIDTH // 2, HEIGHT - 90)
        self.last_shot = 0
        self.spread_level = 1
        self.lives = 3
        self.invulnerable_until = 0

    def update(self, keys):
        dx = 0
        dy = 0
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            dx -= self.speed
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            dx += self.speed
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            dy -= self.speed
        if keys[pygame.K_DOWN] or keys[pygame.K_s]:
            dy += self.speed

        mouse_buttons = pygame.mouse.get_pressed()
        if any(mouse_buttons):
            target_x, target_y = pygame.mouse.get_pos()
            self.rect.centerx += int((target_x - self.rect.centerx) * 0.18)
            self.rect.centery += int((target_y - self.rect.centery) * 0.12)
        else:
            self.rect.x += dx
            self.rect.y += dy

        target_tilt = dx * 2.2
        self.tilt += (target_tilt - self.tilt) * 0.18
        self.engine_phase += 0.25 + abs(dx) * 0.03

        self.rect.clamp_ip(screen.get_rect().inflate(-10, -30))

    def try_shoot(self, bullet_group, now):
        if now - self.last_shot < self.shoot_delay:
            return
        self.last_shot = now

        spread_patterns = {
            1: [0],
            2: [-16, 16],
            3: [-24, 0, 24],
            4: [-30, -10, 10, 30],
        }
        offsets = spread_patterns.get(min(self.spread_level, 4), [-30, -10, 10, 30])
        for offset in offsets:
            bullet_group.add(Bullet(self.rect.centerx + offset, self.rect.top + 4, -14, NEON_BLUE, "player"))
        if sound_player_shoot:
            sound_player_shoot.play()

    def draw(self, offset_x=0, offset_y=0):
        draw_x = self.rect.x + offset_x
        draw_y = self.rect.y + offset_y
        blink = pygame.time.get_ticks() < self.invulnerable_until and (pygame.time.get_ticks() // 100) % 2 == 0
        if not blink:
            flame_len = 16 + 6 * math.sin(self.engine_phase)
            for nozzle_x in (draw_x + 24, draw_x + 48):
                pygame.draw.polygon(
                    screen,
                    ORANGE,
                    [(nozzle_x, draw_y + 52), (nozzle_x - 6, draw_y + 52 + flame_len), (nozzle_x + 6, draw_y + 52 + flame_len)],
                )
                pygame.draw.polygon(
                    screen,
                    NEON_YELLOW,
                    [(nozzle_x, draw_y + 54), (nozzle_x - 3, draw_y + 48 + flame_len * 0.75), (nozzle_x + 3, draw_y + 48 + flame_len * 0.75)],
                )
            image = pygame.transform.rotozoom(self.base_image, -self.tilt, 1.0)
            rect = image.get_rect(center=(self.rect.centerx + offset_x, self.rect.centery + offset_y))
            screen.blit(image, rect)
        if pygame.time.get_ticks() < self.invulnerable_until:
            pygame.draw.circle(
                screen,
                NEON_BLUE,
                (self.rect.centerx + offset_x, self.rect.centery + offset_y),
                34,
                2,
            )


class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y, row, wave):
        super().__init__()
        self.variant = row % 2
        self.base_image = img_enemy_a if self.variant == 0 else img_enemy_b
        self.image = self.base_image
        self.color = NEON_PINK if self.variant == 0 else NEON_GREEN
        self.rect = self.image.get_rect(center=(x, y))
        self.radius = 18
        self.health = 1 + (wave - 1) // 3 + (1 if row == 0 and wave > 2 else 0)
        self.points = 20 + row * 10
        self.fire_chance = 0.0015 + wave * 0.00015
        self.hover_seed = random.uniform(0, math.tau)
        self.row = row

    def fire(self, bullet_group):
        bullet_group.add(Bullet(self.rect.centerx, self.rect.bottom - 5, 8, NEON_RED, "enemy", size=(8, 24)))
        if sound_enemy_shoot:
            sound_enemy_shoot.play()

    def draw(self, offset_x=0, offset_y=0):
        t = pygame.time.get_ticks() * 0.006 + self.hover_seed
        bob = math.sin(t) * 5
        image_rect = self.base_image.get_rect(center=(self.rect.centerx + offset_x, self.rect.centery + offset_y + bob))
        screen.blit(self.base_image, image_rect)
        wing_y = image_rect.centery + 6
        flap = math.sin(t * 2.2) * 8
        left_wing = [(image_rect.left + 8, wing_y), (image_rect.left - 8 - flap, wing_y + 10), (image_rect.left + 12, wing_y + 16)]
        right_wing = [(image_rect.right - 8, wing_y), (image_rect.right + 8 + flap, wing_y + 10), (image_rect.right - 12, wing_y + 16)]
        pygame.draw.polygon(screen, self.color, left_wing)
        pygame.draw.polygon(screen, self.color, right_wing)
        if (pygame.time.get_ticks() // 280) % 7 == 0:
            pygame.draw.line(screen, BLACK, (image_rect.centerx - 12, image_rect.centery - 2), (image_rect.centerx - 2, image_rect.centery - 2), 2)
            pygame.draw.line(screen, BLACK, (image_rect.centerx + 2, image_rect.centery - 2), (image_rect.centerx + 12, image_rect.centery - 2), 2)


class Boss(pygame.sprite.Sprite):
    def __init__(self, wave):
        super().__init__()
        self.base_image = img_boss
        self.image = self.base_image
        self.rect = self.image.get_rect(center=(WIDTH // 2, 130))
        self.radius = 52
        self.wave = wave
        self.health = 40 + wave * 6
        self.max_health = self.health
        self.points = 1000 + wave * 150
        self.direction = 1
        self.speed = 3 + min(3, wave // 4)
        self.last_shot = 0
        self.shoot_delay = max(500, 1000 - wave * 40)
        self.color = PURPLE
        self.hover_seed = random.uniform(0, math.tau)

    def update(self):
        self.rect.x += self.direction * self.speed
        if self.rect.left < 30 or self.rect.right > WIDTH - 30:
            self.direction *= -1
            self.rect.y += 18

    def fire(self, bullet_group, now):
        if now - self.last_shot < self.shoot_delay:
            return
        self.last_shot = now
        for offset in (-50, 0, 50):
            bullet_group.add(Bullet(self.rect.centerx + offset, self.rect.bottom - 10, 9, NEON_YELLOW, "enemy", size=(10, 28)))
        if sound_boss:
            sound_boss.play()

    def draw(self, offset_x=0, offset_y=0):
        t = pygame.time.get_ticks() * 0.004 + self.hover_seed
        bob = math.sin(t) * 6
        pulse = 1 + math.sin(t * 3) * 0.04
        image = pygame.transform.rotozoom(self.base_image, math.sin(t) * 2.5, pulse)
        rect = image.get_rect(center=(self.rect.centerx + offset_x, self.rect.centery + offset_y + bob))
        screen.blit(image, rect)
        for side in (-1, 1):
            flame_x = rect.centerx + side * 56
            flame_y = rect.bottom - 28
            pygame.draw.polygon(screen, NEON_RED, [(flame_x, flame_y), (flame_x + side * 18, flame_y + 10), (flame_x, flame_y + 22)])
            pygame.draw.polygon(screen, NEON_YELLOW, [(flame_x, flame_y + 4), (flame_x + side * 10, flame_y + 10), (flame_x, flame_y + 18)])
        pygame.draw.circle(screen, NEON_YELLOW, (rect.centerx, rect.centery + 8), 24, 2)


class Powerup(pygame.sprite.Sprite):
    def __init__(self, x, y, kind):
        super().__init__()
        self.kind = kind
        self.image = img_powerup_spread if kind == "spread" else img_powerup_life
        self.rect = self.image.get_rect(center=(x, y))
        self.radius = 15
        self.speed = 3

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > HEIGHT:
            self.kill()

    def draw(self, offset_x=0, offset_y=0):
        t = pygame.time.get_ticks() * 0.008 + self.rect.centerx * 0.01
        image = pygame.transform.rotozoom(self.image, math.sin(t) * 20, 1 + math.sin(t * 2) * 0.06)
        rect = image.get_rect(center=(self.rect.centerx + offset_x, self.rect.centery + offset_y + math.sin(t) * 4))
        pygame.draw.circle(screen, NEON_YELLOW, rect.center, 18, 2)
        screen.blit(image, rect)


def add_explosion(particles, x, y, color, amount=24):
    for _ in range(amount):
        particles.append(Particle(x, y, color))


def add_background_gradient():
    for y in range(HEIGHT):
        blend = y / HEIGHT
        color = (
            int(BLACK[0] * (1 - blend) + MIDNIGHT[0] * blend),
            int(BLACK[1] * (1 - blend) + MIDNIGHT[1] * blend),
            int(BLACK[2] * (1 - blend) + MIDNIGHT[2] * blend),
        )
        pygame.draw.line(screen, color, (0, y), (WIDTH, y))


def draw_background_details(nebulae, now):
    for idx, nebula in enumerate(nebulae):
        phase = now * 0.00035 + idx
        radius = nebula["radius"] + math.sin(phase) * 10
        surf = pygame.Surface((int(radius * 2.6), int(radius * 2.6)), pygame.SRCALPHA)
        center = surf.get_width() // 2, surf.get_height() // 2
        for ring in range(3, 0, -1):
            alpha = nebula["alpha"] // (ring + 1)
            pygame.draw.circle(surf, (*nebula["color"], alpha), center, int(radius * ring / 2.6))
        screen.blit(surf, (nebula["x"] - center[0], nebula["y"] - center[1]), special_flags=pygame.BLEND_RGBA_ADD)
    for y in range(110, HEIGHT, 120):
        pygame.draw.line(screen, (28, 38, 72), (40, y), (WIDTH - 40, y), 1)
    for x in range(60, WIDTH, 140):
        pygame.draw.line(screen, (18, 52, 88), (x, 80), (x, HEIGHT - 40), 1)


def spawn_wave(enemies, wave):
    rows = min(5, 2 + wave // 2)
    cols = min(10, 5 + wave)
    start_x = 110
    start_y = 110
    spacing_x = 88
    spacing_y = 68
    enemies.empty()
    for row in range(rows):
        for col in range(cols):
            x = start_x + col * spacing_x
            y = start_y + row * spacing_y
            enemies.add(Enemy(x, y, row, wave))


def move_wave(enemies, wave_state):
    if not enemies:
        return
    shift_down = False
    for enemy in enemies:
        enemy.rect.x += wave_state["direction"] * wave_state["speed"]
        if enemy.rect.right >= WIDTH - 30 or enemy.rect.left <= 30:
            shift_down = True
    if shift_down:
        wave_state["direction"] *= -1
        for enemy in enemies:
            enemy.rect.y += 22


def enemy_fire(enemies, enemy_bullets):
    if not enemies:
        return
    columns = {}
    for enemy in enemies:
        key = round(enemy.rect.centerx / 20)
        columns.setdefault(key, []).append(enemy)
    shooters = []
    for group in columns.values():
        shooters.append(max(group, key=lambda e: e.rect.centery))
    for shooter in shooters:
        if random.random() < shooter.fire_chance:
            shooter.fire(enemy_bullets)


def draw_text(text, font, color, center):
    surf = font.render(text, True, color)
    screen.blit(surf, surf.get_rect(center=center))


def draw_hud(score, wave, player, boss):
    score_text = font_main.render(f"SCORE {score}", True, WHITE)
    wave_text = font_main.render(f"WAVE {wave}", True, NEON_YELLOW)
    lives_text = font_main.render(f"LIVES {player.lives}", True, NEON_GREEN)
    spread_text = font_small.render(f"SPREAD x{player.spread_level}", True, NEON_BLUE)

    screen.blit(score_text, (20, 14))
    screen.blit(wave_text, (WIDTH // 2 - wave_text.get_width() // 2, 14))
    screen.blit(lives_text, (WIDTH - lives_text.get_width() - 24, 14))
    screen.blit(spread_text, (20, 52))

    if boss:
        pygame.draw.rect(screen, NEON_RED, (WIDTH // 2 - 180, 56, 360, 18), border_radius=9)
        current_width = int(360 * max(0, boss.health) / boss.max_health)
        pygame.draw.rect(screen, PURPLE, (WIDTH // 2 - 180, 56, current_width, 18), border_radius=9)
        pygame.draw.rect(screen, WHITE, (WIDTH // 2 - 180, 56, 360, 18), 2, border_radius=9)


def reset_groups(*groups):
    for group in groups:
        group.empty()


def main():
    stars = [Star() for _ in range(160)]
    nebulae = [
        {"x": 180, "y": 130, "radius": 90, "color": NEON_PINK, "alpha": 34},
        {"x": 840, "y": 210, "radius": 120, "color": PURPLE, "alpha": 30},
        {"x": 540, "y": 620, "radius": 160, "color": SKY, "alpha": 22},
    ]
    particles = []
    player_bullets = pygame.sprite.Group()
    enemy_bullets = pygame.sprite.Group()
    enemies = pygame.sprite.Group()
    powerups = pygame.sprite.Group()
    boss_group = pygame.sprite.GroupSingle()
    player = Player()

    game_state = "menu"
    score = 0
    wave = 1
    wave_banner_until = 0
    screen_shake = 0
    wave_state = {"direction": 1, "speed": 2}

    pygame.mouse.set_visible(True)
    running = True

    def start_run():
        nonlocal game_state, score, wave, wave_banner_until, screen_shake, wave_state
        score = 0
        wave = 1
        screen_shake = 0
        wave_state = {"direction": 1, "speed": 2.2}
        player.reset_for_run()
        reset_groups(player_bullets, enemy_bullets, enemies, powerups, boss_group)
        particles.clear()
        spawn_wave(enemies, wave)
        wave_banner_until = pygame.time.get_ticks() + 1800
        game_state = "playing"
        pygame.mouse.set_visible(False)

    while running:
        now = pygame.time.get_ticks()
        keys = pygame.key.get_pressed()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
                if game_state in {"menu", "game_over"} and event.key in {pygame.K_SPACE, pygame.K_RETURN}:
                    start_run()
            if event.type == pygame.MOUSEBUTTONDOWN and game_state in {"menu", "game_over"}:
                start_run()

        if game_state == "playing":
            player.update(keys)
            player_bullets.update()
            enemy_bullets.update()
            powerups.update()
            boss_group.update()

            if keys[pygame.K_SPACE] or pygame.mouse.get_pressed()[0]:
                player.try_shoot(player_bullets, now)

            move_wave(enemies, wave_state)
            enemy_fire(enemies, enemy_bullets)

            boss = boss_group.sprite
            if boss:
                boss.fire(enemy_bullets, now)

            for star in stars:
                star.update(1.5)

            for particle in particles[:]:
                particle.update()
                if particle.life <= 0:
                    particles.remove(particle)

            for bullet in list(player_bullets):
                enemy_hits = pygame.sprite.spritecollide(bullet, enemies, False, pygame.sprite.collide_circle)
                if enemy_hits:
                    bullet.kill()
                    target = enemy_hits[0]
                    target.health -= 1
                    add_explosion(particles, bullet.rect.centerx, bullet.rect.centery, target.color, 8)
                    if target.health <= 0:
                        score += target.points
                        add_explosion(particles, target.rect.centerx, target.rect.centery, target.color, 22)
                        if sound_explode:
                            sound_explode.play()
                        if random.random() < 0.12:
                            kind = "life" if random.random() < 0.18 and player.lives < 5 else "spread"
                            powerups.add(Powerup(target.rect.centerx, target.rect.centery, kind))
                        target.kill()
                    continue

                if boss and pygame.sprite.collide_circle(bullet, boss):
                    bullet.kill()
                    boss.health -= 1
                    add_explosion(particles, bullet.rect.centerx, bullet.rect.centery, PURPLE, 9)
                    if boss.health <= 0:
                        score += boss.points
                        add_explosion(particles, boss.rect.centerx, boss.rect.centery, PURPLE, 60)
                        boss_group.empty()
                        wave += 1
                        wave_state["speed"] = min(5.5, 2 + wave * 0.25)
                        spawn_wave(enemies, wave)
                        wave_banner_until = now + 2200

            if pygame.time.get_ticks() >= player.invulnerable_until:
                bullet_hits = pygame.sprite.spritecollide(player, enemy_bullets, True, pygame.sprite.collide_circle)
                enemy_hits = pygame.sprite.spritecollide(player, enemies, True, pygame.sprite.collide_circle)
                boss_hit = boss and pygame.sprite.collide_circle(player, boss)
                if bullet_hits or enemy_hits or boss_hit:
                    player.lives -= 1
                    player.invulnerable_until = pygame.time.get_ticks() + 2200
                    screen_shake = 16
                    if sound_hit:
                        sound_hit.play()
                    add_explosion(particles, player.rect.centerx, player.rect.centery, NEON_RED, 26)
                    enemy_bullets.empty()
                    if boss_hit:
                        add_explosion(particles, boss.rect.centerx, boss.rect.centery, boss.color, 18)
                    if player.lives <= 0:
                        game_state = "game_over"
                        pygame.mouse.set_visible(True)

            for enemy in enemies:
                if enemy.rect.bottom >= HEIGHT - 120:
                    game_state = "game_over"
                    pygame.mouse.set_visible(True)
                    break

            collected = pygame.sprite.spritecollide(player, powerups, True, pygame.sprite.collide_circle)
            for powerup in collected:
                if powerup.kind == "spread":
                    player.spread_level = min(4, player.spread_level + 1)
                else:
                    player.lives = min(5, player.lives + 1)
                if sound_pickup:
                    sound_pickup.play()
                add_explosion(particles, powerup.rect.centerx, powerup.rect.centery, NEON_YELLOW, 14)

            if not enemies and not boss_group:
                if wave % 4 == 0:
                    boss_group.add(Boss(wave))
                    if sound_boss:
                        sound_boss.play()
                    wave_banner_until = now + 2200
                else:
                    wave += 1
                    wave_state["speed"] = min(5.5, 2 + wave * 0.25)
                    spawn_wave(enemies, wave)
                    wave_banner_until = now + 1800
        else:
            for star in stars:
                star.update(0.2)
            for particle in particles[:]:
                particle.update()
                if particle.life <= 0:
                    particles.remove(particle)

        add_background_gradient()
        draw_background_details(nebulae, now)

        shake_x = 0
        shake_y = 0
        if screen_shake > 0:
            shake_x = random.randint(-screen_shake, screen_shake)
            shake_y = random.randint(-screen_shake, screen_shake)
            screen_shake = max(0, screen_shake - 1)

        for star in stars:
            star.draw(shake_x * 0.2, shake_y * 0.2)

        particle_surf = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
        for particle in particles:
            particle.draw(particle_surf)
        screen.blit(particle_surf, (0, 0), special_flags=pygame.BLEND_RGBA_ADD)

        for enemy in enemies:
            enemy.draw(shake_x, shake_y)
        for bullet in player_bullets:
            screen.blit(bullet.image, (bullet.rect.x + shake_x, bullet.rect.y + shake_y))
        for bullet in enemy_bullets:
            screen.blit(bullet.image, (bullet.rect.x + shake_x, bullet.rect.y + shake_y))
        for powerup in powerups:
            powerup.draw(shake_x, shake_y)

        if boss_group.sprite:
            boss = boss_group.sprite
            boss.draw(shake_x, shake_y)

        if game_state == "playing":
            player.draw(shake_x, shake_y)
            draw_hud(score, wave, player, boss_group.sprite)
            if now < wave_banner_until:
                banner = f"BOSS WAVE {wave}" if boss_group.sprite else f"WAVE {wave}"
                draw_text(banner, font_main, NEON_YELLOW, (WIDTH // 2, 110))
        elif game_state == "menu":
            draw_text("NEON INVADERS", font_big, NEON_PINK, (WIDTH // 2, HEIGHT // 3))
            draw_text("Arcade mode inspired by Chicken Invaders", font_main, WHITE, (WIDTH // 2, HEIGHT // 3 + 84))
            draw_text("Move with WASD or arrows. Shoot with SPACE or mouse click.", font_small, NEON_BLUE, (WIDTH // 2, HEIGHT // 2 + 20))
            draw_text("Collect S for spread shots and L for extra lives.", font_small, NEON_GREEN, (WIDTH // 2, HEIGHT // 2 + 55))
            draw_text("Press SPACE or click to start", font_main, NEON_YELLOW, (WIDTH // 2, HEIGHT * 0.72))
        else:
            draw_text("GAME OVER", font_big, NEON_RED, (WIDTH // 2, HEIGHT // 3))
            draw_text(f"Final score: {score}", font_main, WHITE, (WIDTH // 2, HEIGHT // 2))
            draw_text("Press SPACE or click to play again", font_main, NEON_YELLOW, (WIDTH // 2, HEIGHT * 0.72))

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()


if __name__ == "__main__":
    main()
