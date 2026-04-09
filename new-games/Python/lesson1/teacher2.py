import math
import random

import pygame


pygame.init()

WIDTH, HEIGHT = 1080, 720
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Galaxy Arena X - Enhanced")
clock = pygame.time.Clock()
FPS = 60

BG = (10, 14, 30)
BG_2 = (20, 26, 52)
WHITE = (245, 247, 255)
BLACK = (15, 18, 30)
CYAN = (70, 235, 255)
BLUE = (88, 150, 255)
GREEN = (90, 255, 145)
YELLOW = (255, 224, 90)
ORANGE = (255, 165, 90)
RED = (255, 95, 95)
PINK = (255, 92, 205)
PURPLE = (148, 110, 255)
DARK_BG = (8, 10, 22)
ACCENT = (100, 255, 200)

try:
    font_small = pygame.font.SysFont("consolas", 20)
    font_main = pygame.font.SysFont("impact", 34)
    font_big = pygame.font.SysFont("impact", 80)
except Exception:
    font_small = pygame.font.SysFont(None, 20)
    font_main = pygame.font.SysFont(None, 34)
    font_big = pygame.font.SysFont(None, 80)


def clamp(value, minimum, maximum):
    return max(minimum, min(maximum, value))


def draw_glow(surface, color, center, radius, intensity=0.3):
    """Draw a glowing circle with multiple layers for depth"""
    for i in range(3):
        alpha = int(50 * intensity * (1 - i / 3))
        glow_surf = pygame.Surface((radius * 6, radius * 6), pygame.SRCALPHA)
        pygame.draw.circle(glow_surf, (*color, alpha), (radius * 3, radius * 3), radius + i * 4)
        surface.blit(glow_surf, (center[0] - radius * 3, center[1] - radius * 3), special_flags=pygame.BLEND_RGBA_ADD)


def draw_background():
    for y in range(HEIGHT):
        blend = y / HEIGHT
        color = (
            int(BG[0] * (1 - blend) + BG_2[0] * blend),
            int(BG[1] * (1 - blend) + BG_2[1] * blend),
            int(BG[2] * (1 - blend) + BG_2[2] * blend),
        )
        pygame.draw.line(screen, color, (0, y), (WIDTH, y))
    for x in range(40, WIDTH, 120):
        pygame.draw.line(screen, (18, 34, 72), (x, 0), (x, HEIGHT), 1)
    for y in range(40, HEIGHT, 120):
        pygame.draw.line(screen, (20, 30, 62), (0, y), (WIDTH, y), 1)


class Star:
    def __init__(self):
        self.reset()
        self.y = random.uniform(0, HEIGHT)

    def reset(self):
        self.x = random.uniform(0, WIDTH)
        self.y = random.uniform(-HEIGHT, 0)
        self.speed = random.uniform(0.5, 2.4)
        self.size = random.randint(1, 3)
        shade = random.randint(120, 255)
        self.color = (shade, shade, 255)

    def update(self):
        self.y += self.speed
        if self.y > HEIGHT:
            self.reset()

    def draw(self):
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), self.size)


class Particle:
    def __init__(self, x, y, color, speed_range=(2, 8), size_range=(2, 6), decay=0.035):
        self.x = x
        self.y = y
        angle = random.uniform(0, math.tau)
        speed = random.uniform(*speed_range)
        self.dx = math.cos(angle) * speed
        self.dy = math.sin(angle) * speed
        self.color = color
        self.size = random.uniform(*size_range)
        self.life = 1.0
        self.decay = decay

    def update(self):
        self.x += self.dx
        self.y += self.dy
        self.dx *= 0.97
        self.dy *= 0.97
        self.life -= self.decay
        self.size *= 0.98

    def draw(self, surface):
        if self.life <= 0:
            return
        alpha = clamp(int(self.life * 255), 0, 255)
        glow = pygame.Surface((int(self.size * 5), int(self.size * 5)), pygame.SRCALPHA)
        center = glow.get_width() // 2, glow.get_height() // 2
        pygame.draw.circle(glow, (*self.color, alpha // 5), center, max(2, int(self.size * 1.8)))
        surface.blit(glow, (self.x - center[0], self.y - center[1]), special_flags=pygame.BLEND_RGBA_ADD)
        pygame.draw.circle(surface, (*WHITE, alpha), (int(self.x), int(self.y)), max(1, int(self.size)))


class Bullet:
    def __init__(self, x, y, angle, speed, color, owner, damage=1, radius=6):
        self.x = x
        self.y = y
        self.dx = math.cos(angle) * speed
        self.dy = math.sin(angle) * speed
        self.color = color
        self.owner = owner
        self.damage = damage
        self.radius = radius
        self.life = 120

    def update(self):
        self.x += self.dx
        self.y += self.dy
        self.life -= 1
        return self.life > 0 and -20 < self.x < WIDTH + 20 and -20 < self.y < HEIGHT + 20

    def draw(self):
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), self.radius)
        pygame.draw.circle(screen, WHITE, (int(self.x), int(self.y)), max(2, self.radius - 2), 2)
        # Glow effect
        draw_glow(screen, self.color, (int(self.x), int(self.y)), self.radius * 1.2, 0.25)


class Powerup:
    def __init__(self, x, y, kind):
        self.x = x
        self.y = y
        self.kind = kind
        self.radius = 18
        self.phase = random.uniform(0, math.tau)
        self.color = YELLOW if kind == "spread" else GREEN if kind == "heal" else PINK

    def rect(self):
        return pygame.Rect(self.x - 20, self.y - 20, 40, 40)

    def draw(self, now):
        bob = math.sin(now * 0.006 + self.phase) * 5
        center = (int(self.x), int(self.y + bob))
        pygame.draw.circle(screen, self.color, center, self.radius)
        pygame.draw.circle(screen, WHITE, center, self.radius, 2)
        label = "S" if self.kind == "spread" else "H" if self.kind == "heal" else "R"
        text = font_small.render(label, True, BLACK)
        screen.blit(text, text.get_rect(center=center))


class UpgradesSystem:
    def __init__(self):
        self.upgrades = {
            "fire_rate": {"cost": 100, "level": 0, "max_level": 5, "description": "Fire Rate", "icon": "🔥"},
            "damage": {"cost": 150, "level": 0, "max_level": 5, "description": "Bullet Damage", "icon": "💥"},
            "health": {"cost": 120, "level": 0, "max_level": 5, "description": "Max Health", "icon": "❤️"},
            "energy": {"cost": 100, "level": 0, "max_level": 4, "description": "Dash Energy", "icon": "⚡"},
        }
        self.score_spent = 0

    def get_upgrade_effect(self, upgrade_type):
        """Return the current effect of an upgrade"""
        level = self.upgrades[upgrade_type]["level"]
        if upgrade_type == "fire_rate":
            return -20 * level  # Reduces shoot delay
        elif upgrade_type == "damage":
            return 1 + 0.2 * level  # Damage multiplier
        elif upgrade_type == "health":
            return 50 + 20 * level  # Max health
        elif upgrade_type == "energy":
            return 100 + 30 * level  # Max energy
        return 0

    def can_upgrade(self, upgrade_type, current_score):
        upgrade = self.upgrades[upgrade_type]
        return upgrade["level"] < upgrade["max_level"] and current_score - self.score_spent >= upgrade["cost"]

    def upgrade(self, upgrade_type):
        if upgrade_type in self.upgrades:
            upgrade = self.upgrades[upgrade_type]
            if upgrade["level"] < upgrade["max_level"]:
                self.score_spent += upgrade["cost"]
                upgrade["cost"] = int(upgrade["cost"] * 1.3)
                upgrade["level"] += 1
                return True
        return False


class Player:
    def __init__(self, upgrades_system=None):
        self.radius = 20
        self.upgrades_system = upgrades_system
        self.reset()

    def reset(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 2
        self.speed = 5.4
        self.health = 100
        self.max_health = 100 if not self.upgrades_system else int(self.upgrades_system.get_upgrade_effect("health"))
        self.energy = 100
        self.max_energy = 100 if not self.upgrades_system else int(self.upgrades_system.get_upgrade_effect("energy"))
        self.last_shot = 0
        self.shoot_delay = 170
        self.last_dash = -9999
        self.dash_cooldown = 1200
        self.invulnerable_until = 0
        self.weapon_level = 1
        self.rapid_until = 0
        self.angle = 0
        self.step_phase = 0

    def rect(self):
        return pygame.Rect(self.x - self.radius, self.y - self.radius, self.radius * 2, self.radius * 2)

    def update(self, keys):
        dx = (keys[pygame.K_d] or keys[pygame.K_RIGHT]) - (keys[pygame.K_a] or keys[pygame.K_LEFT])
        dy = (keys[pygame.K_s] or keys[pygame.K_DOWN]) - (keys[pygame.K_w] or keys[pygame.K_UP])
        length = math.hypot(dx, dy)
        if length:
            dx /= length
            dy /= length
            self.x += dx * self.speed
            self.y += dy * self.speed
            self.step_phase += 0.25
        self.x = clamp(self.x, 30, WIDTH - 30)
        self.y = clamp(self.y, 30, HEIGHT - 30)
        self.energy = clamp(self.energy + 0.14, 0, self.max_energy)
        self.angle = math.atan2(pygame.mouse.get_pos()[1] - self.y, pygame.mouse.get_pos()[0] - self.x)
        return dx, dy

    def can_shoot(self, now):
        fire_rate_bonus = self.upgrades_system.get_upgrade_effect("fire_rate") if self.upgrades_system else 0
        active_delay = 95 - int(abs(fire_rate_bonus) * 0.5) if now < self.rapid_until else self.shoot_delay + int(fire_rate_bonus)
        return now - self.last_shot >= active_delay

    def shoot(self, now):
        self.last_shot = now
        damage_multiplier = self.upgrades_system.get_upgrade_effect("damage") if self.upgrades_system else 1
        patterns = {
            1: [0],
            2: [-0.16, 0.16],
            3: [-0.22, 0, 0.22],
            4: [-0.32, -0.1, 0.1, 0.32],
        }
        bullets = []
        for offset in patterns[min(4, self.weapon_level)]:
            bullets.append(Bullet(self.x, self.y, self.angle + offset, 12, CYAN, "player", damage=int(damage_multiplier)))
        return bullets

    def dash(self, direction, now):
        if now - self.last_dash < self.dash_cooldown or self.energy < 35:
            return False
        dx, dy = direction
        if dx == 0 and dy == 0:
            dx = math.cos(self.angle)
            dy = math.sin(self.angle)
        length = math.hypot(dx, dy)
        dx /= length
        dy /= length
        self.x += dx * 140
        self.y += dy * 140
        self.x = clamp(self.x, 30, WIDTH - 30)
        self.y = clamp(self.y, 30, HEIGHT - 30)
        self.energy -= 35
        self.last_dash = now
        self.invulnerable_until = now + 260
        return True

    def draw(self, now):
        blink = now < self.invulnerable_until and (now // 100) % 2 == 0
        if blink:
            return
        center = (int(self.x), int(self.y))

        # glow effect and hull
        draw_glow(screen, BLUE, center, 26, 0.35)
        pygame.draw.circle(screen, DARK_BG, center, 26)
        pygame.draw.circle(screen, CYAN, center, 24, 3)

        # spaceship body
        nose = (self.x + math.cos(self.angle) * 35, self.y + math.sin(self.angle) * 35)
        left_wing = (self.x + math.cos(self.angle + 2.2) * 28, self.y + math.sin(self.angle + 2.2) * 28)
        right_wing = (self.x + math.cos(self.angle - 2.2) * 28, self.y + math.sin(self.angle - 2.2) * 28)
        body = [nose, left_wing, right_wing]
        pygame.draw.polygon(screen, BLUE, body)
        pygame.draw.polygon(screen, WHITE, body, 2)

        # cockpit
        cockpit = (self.x + math.cos(self.angle) * 10, self.y + math.sin(self.angle) * 10)
        pygame.draw.circle(screen, BLACK, (int(cockpit[0]), int(cockpit[1])), 8)
        pygame.draw.circle(screen, CYAN, (int(cockpit[0]), int(cockpit[1])), 8, 2)

        # rear thruster flames
        for side in (-1, 1):
            flame_angle = self.angle + math.pi + side * 0.3
            flame_len = 14 + math.sin(now * 0.04 + side) * 5
            rear = (self.x + math.cos(self.angle + math.pi) * 14, self.y + math.sin(self.angle + math.pi) * 14)
            flame = (rear[0] + math.cos(flame_angle) * flame_len, rear[1] + math.sin(flame_angle) * flame_len)
            pygame.draw.line(screen, ORANGE, rear, flame, 4)
            inner_flame = (rear[0] + math.cos(flame_angle) * (flame_len * 0.55), rear[1] + math.sin(flame_angle) * (flame_len * 0.55))
            pygame.draw.line(screen, YELLOW, rear, inner_flame, 2)


class Enemy:
    def __init__(self, x, y, kind, wave):
        self.x = x
        self.y = y
        self.kind = kind
        self.wave = wave
        self.phase = random.uniform(0, math.tau)
        if kind == "chaser":
            self.radius = 18
            self.color = ORANGE
            self.speed = 1.9 + wave * 0.06
            self.health = 2 + wave // 4
            self.points = 25
        elif kind == "shooter":
            self.radius = 20
            self.color = PINK
            self.speed = 1.2 + wave * 0.05
            self.health = 3 + wave // 3
            self.points = 40
        else:
            self.radius = 28
            self.color = PURPLE
            self.speed = 0.9 + wave * 0.04
            self.health = 7 + wave
            self.points = 90
        self.max_health = self.health
        self.last_shot = random.randint(0, 600)

    def rect(self):
        return pygame.Rect(self.x - self.radius, self.y - self.radius, self.radius * 2, self.radius * 2)

    def update(self, player, now):
        dx = player.x - self.x
        dy = player.y - self.y
        distance = max(1, math.hypot(dx, dy))
        bullets = []
        if self.kind == "chaser":
            self.x += dx / distance * self.speed
            self.y += dy / distance * self.speed
        elif self.kind == "shooter":
            desired = 240
            move = 0
            if distance > desired + 35:
                move = 1
            elif distance < desired - 35:
                move = -1
            self.x += dx / distance * self.speed * move + math.cos(now * 0.004 + self.phase) * 0.7
            self.y += dy / distance * self.speed * move + math.sin(now * 0.004 + self.phase) * 0.7
            if now - self.last_shot > max(700, 1450 - self.wave * 25):
                self.last_shot = now
                angle = math.atan2(dy, dx)
                bullets.append(Bullet(self.x, self.y, angle, 6.5, RED, "enemy", radius=7))
        else:
            self.x += dx / distance * self.speed
            self.y += dy / distance * self.speed
            if now - self.last_shot > max(900, 1800 - self.wave * 20):
                self.last_shot = now
                base = math.atan2(dy, dx)
                for offset in (-0.28, 0, 0.28):
                    bullets.append(Bullet(self.x, self.y, base + offset, 6, YELLOW, "enemy", radius=8))

        self.x = clamp(self.x, 28, WIDTH - 28)
        self.y = clamp(self.y, 28, HEIGHT - 28)
        return bullets

    def draw(self, now):
        bob = math.sin(now * 0.006 + self.phase) * 4
        center = (int(self.x), int(self.y + bob))
        
        # Glow effect
        draw_glow(screen, self.color, center, self.radius, 0.35)
        
        pygame.draw.circle(screen, self.color, center, self.radius)
        pygame.draw.circle(screen, WHITE, center, self.radius, 2)
        if self.kind == "chaser":
            # small alien scout with antennae
            pygame.draw.circle(screen, BLACK, (center[0] - 5, center[1] - 3), 4)
            pygame.draw.circle(screen, BLACK, (center[0] + 5, center[1] - 3), 4)
            pygame.draw.line(screen, CYAN, (center[0], center[1] - self.radius), (center[0], center[1] - self.radius - 8), 2)
            pygame.draw.circle(screen, CYAN, (center[0], center[1] - self.radius - 10), 3)
        elif self.kind == "shooter":
            # shooter is an alien ship with extra eye and side fins
            brain = (center[0], center[1] - 4)
            pygame.draw.polygon(screen, PURPLE, [(center[0], center[1] - self.radius), (center[0] - self.radius, center[1] + self.radius), (center[0] + self.radius, center[1] + self.radius)])
            pygame.draw.circle(screen, BLACK, brain, 5)
            pygame.draw.circle(screen, WHITE, brain, 3)
            pygame.draw.line(screen, PINK, (center[0] - self.radius, center[1] + 2), (center[0] + self.radius, center[1] + 2), 2)
        else:
            # tank alien with tentacles
            body = pygame.Rect(center[0] - self.radius, center[1] - self.radius, self.radius * 2, self.radius * 2)
            pygame.draw.ellipse(screen, self.color, body)
            pygame.draw.rect(screen, PURPLE, (center[0] - self.radius // 2, center[1] - self.radius // 2, self.radius, self.radius // 2), border_radius=8)
            for i in range(-2, 3):
                x = center[0] + i * (self.radius // 3)
                pygame.draw.line(screen, CYAN, (x, center[1] + self.radius * 0.65), (x + math.sin(now * 0.01 + i) * 8, center[1] + self.radius + 16), 3)

        bar_w = self.radius * 2
        current = int(bar_w * self.health / self.max_health)
        pygame.draw.rect(screen, RED, (center[0] - self.radius, center[1] - self.radius - 14, bar_w, 6), border_radius=3)
        pygame.draw.rect(screen, GREEN, (center[0] - self.radius, center[1] - self.radius - 14, current, 6), border_radius=3)


def spawn_enemy(wave):
    side = random.choice(["top", "bottom", "left", "right"])
    if side == "top":
        x, y = random.randint(40, WIDTH - 40), -30
    elif side == "bottom":
        x, y = random.randint(40, WIDTH - 40), HEIGHT + 30
    elif side == "left":
        x, y = -30, random.randint(40, HEIGHT - 40)
    else:
        x, y = WIDTH + 30, random.randint(40, HEIGHT - 40)

    roll = random.random()
    if wave >= 3 and roll > 0.78:
        kind = "tank"
    elif wave >= 2 and roll > 0.45:
        kind = "shooter"
    else:
        kind = "chaser"
    return Enemy(x, y, kind, wave)


def add_burst(particles, x, y, color, amount=18):
    for _ in range(amount):
        particles.append(Particle(x, y, color))


def draw_hud(player, score, wave, enemies_left, now, upgrades_system):
    panel = pygame.Rect(16, 14, 380, 112)
    pygame.draw.rect(screen, (12, 18, 34), panel, border_radius=18)
    pygame.draw.rect(screen, BLUE, panel, 3, border_radius=18)
    screen.blit(font_main.render("GALAXY ARENA X", True, WHITE), (28, 18))
    screen.blit(font_small.render(f"Score: {score}", True, CYAN), (30, 58))
    screen.blit(font_small.render(f"Wave: {wave}", True, YELLOW), (150, 58))
    screen.blit(font_small.render(f"Enemies: {enemies_left}", True, GREEN), (245, 58))
    screen.blit(font_small.render(f"Weapon Lvl: {player.weapon_level}", True, ACCENT), (30, 88))

    pygame.draw.rect(screen, RED, (WIDTH - 260, 24, 200, 16), border_radius=8)
    pygame.draw.rect(screen, GREEN, (WIDTH - 260, 24, int(200 * player.health / player.max_health), 16), border_radius=8)
    pygame.draw.rect(screen, WHITE, (WIDTH - 260, 24, 200, 16), 2, border_radius=8)
    pygame.draw.rect(screen, (36, 56, 110), (WIDTH - 260, 52, 200, 14), border_radius=7)
    pygame.draw.rect(screen, CYAN, (WIDTH - 260, 52, int(200 * player.energy / player.max_energy), 14), border_radius=7)
    pygame.draw.rect(screen, WHITE, (WIDTH - 260, 52, 200, 14), 2, border_radius=7)
    cooldown = max(0, (player.dash_cooldown - (now - player.last_dash)) / 1000)
    dash_text = "Dash Ready" if cooldown == 0 else f"Dash: {cooldown:.1f}s"
    screen.blit(font_small.render(dash_text, True, YELLOW), (WIDTH - 258, 82))


def draw_upgrades_menu(score, upgrades_system):
    """Draw the upgrades menu between waves"""
    # Background
    alpha_surface = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
    pygame.draw.rect(alpha_surface, (0, 0, 0, 180), (0, 0, WIDTH, HEIGHT))
    screen.blit(alpha_surface, (0, 0))
    
    # Main panel - adjusted size
    panel_width = 900
    panel_height = 480
    panel_rect = pygame.Rect(WIDTH // 2 - panel_width // 2, HEIGHT // 2 - panel_height // 2, panel_width, panel_height)
    pygame.draw.rect(screen, DARK_BG, panel_rect, border_radius=24)
    pygame.draw.rect(screen, CYAN, panel_rect, 4, border_radius=24)
    
    # Title
    title = font_big.render("UPGRADES AVAILABLE", True, WHITE)
    screen.blit(title, title.get_rect(center=(WIDTH // 2, HEIGHT // 2 - 190)))
    
    # Score display
    available = score - upgrades_system.score_spent
    score_text = font_small.render(f"Available Points: {available} / {score}", True, YELLOW)
    screen.blit(score_text, score_text.get_rect(center=(WIDTH // 2, HEIGHT // 2 - 140)))
    
    # Upgrade buttons - 2x2 grid (2 columns, 2 rows)
    button_width = 220
    button_height = 90
    cols = 2
    col_spacing = 280
    row_spacing = 135
    
    # Center the grid
    grid_width = (cols - 1) * col_spacing + button_width
    start_x = WIDTH // 2 - grid_width // 2
    start_y = HEIGHT // 2 - 50
    
    for idx, (upgrade_type, upgrade_data) in enumerate(upgrades_system.upgrades.items()):
        col = idx % cols
        row = idx // cols
        
        x = start_x + col * col_spacing
        y = start_y + row * row_spacing
        
        button_rect = pygame.Rect(x, y, button_width, button_height)
        
        # Check if can upgrade
        can_upgrade = upgrades_system.can_upgrade(upgrade_type, score)
        
        # Button color
        btn_color = ACCENT if can_upgrade else (50, 50, 60)
        pygame.draw.rect(screen, btn_color, button_rect, border_radius=14)
        pygame.draw.rect(screen, CYAN if can_upgrade else BLUE, button_rect, 3, border_radius=14)
        
        # Upgrade name (emoji + name)
        emoji = upgrade_data["icon"]
        name_display = f"{emoji} {upgrade_data['description']}"
        name_text = font_small.render(name_display, True, WHITE)
        screen.blit(name_text, name_text.get_rect(center=(x + button_width // 2, y + 22)))
        
        # Level
        level_text = font_small.render(f"Lvl: {upgrade_data['level']}/{upgrade_data['max_level']}", True, CYAN)
        screen.blit(level_text, level_text.get_rect(center=(x + button_width // 2, y + 48)))
        
        # Cost
        cost_color = GREEN if can_upgrade else RED
        cost_text = font_small.render(f"Cost: {upgrade_data['cost']}", True, cost_color)
        screen.blit(cost_text, cost_text.get_rect(center=(x + button_width // 2, y + 70)))
    
    # Instructions
    instructions = font_small.render("Click to upgrade | Press SPACE to continue", True, WHITE)
    screen.blit(instructions, instructions.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 200)))


def draw_message(title, subtitle, footer, now=None):
    if now is None:
        now = pygame.time.get_ticks()
    
    draw_background()
    
    # Precise panel layout
    box_width = 800
    box_height = 420
    box_x = WIDTH // 2 - box_width // 2
    box_y = HEIGHT // 2 - box_height // 2
    box = pygame.Rect(box_x, box_y, box_width, box_height)
    
    # Background with border
    pygame.draw.rect(screen, DARK_BG, box, border_radius=32)
    pygame.draw.rect(screen, CYAN, box, 5, border_radius=32)
    
    # Inner decorative lines - precisely positioned
    line_margin = 30
    pygame.draw.line(screen, (50, 150, 200), (box.x + line_margin, box.y + line_margin), (box.x + box_width - line_margin, box.y + line_margin), 2)
    pygame.draw.line(screen, (50, 150, 200), (box.x + line_margin, box.y + box_height - line_margin), (box.x + box_width - line_margin, box.y + box_height - line_margin), 2)
    
    # Content positioning - perfectly centered
    content_center_x = WIDTH // 2
    content_y_start = box_y + 50  # 50px from top of box
    
    # Title - positioned precisely
    title_surf = font_big.render(title, True, WHITE)
    title_rect = title_surf.get_rect(center=(content_center_x, content_y_start + 35))
    screen.blit(title_surf, title_rect)
    
    # Subtitle - with exact spacing
    sub_surf = font_main.render(subtitle, True, CYAN)
    sub_rect = sub_surf.get_rect(center=(content_center_x, content_y_start + 110))
    screen.blit(sub_surf, sub_rect)
    
    # Instructions - with proper spacing
    foot_surf = font_small.render(footer, True, WHITE)
    foot_rect = foot_surf.get_rect(center=(content_center_x, content_y_start + 175))
    screen.blit(foot_surf, foot_rect)
    
    # Bottom prompt with animation
    pulse = abs(math.sin(now * 0.003)) * 40 + 180
    prompt_color = (int(70 + pulse / 12), 235, 255)
    prompt_surf = font_small.render("Press SPACE or Click to Start", True, prompt_color)
    prompt_rect = prompt_surf.get_rect(center=(content_center_x, content_y_start + 260))
    screen.blit(prompt_surf, prompt_rect)


def main():
    stars = [Star() for _ in range(140)]
    particles = []
    bullets = []
    powerups = []
    enemies = []
    upgrades_system = UpgradesSystem()
    player = Player(upgrades_system)

    score = 0
    wave = 1
    enemies_to_spawn = 0
    spawned_this_wave = 0
    last_spawn = 0
    wave_banner_until = 0
    state = "menu"
    running = True
    
    # Upgrades menu
    show_upgrades = False
    selected_upgrade = 0

    def start_game():
        nonlocal score, wave, enemies_to_spawn, spawned_this_wave, last_spawn, wave_banner_until, state
        player.reset()
        score = 0
        wave = 1
        enemies.clear()
        bullets.clear()
        powerups.clear()
        particles.clear()
        upgrades_system.upgrades = {
            "fire_rate": {"cost": 100, "level": 0, "max_level": 5, "description": "Fire Rate", "icon": "🔥"},
            "damage": {"cost": 150, "level": 0, "max_level": 5, "description": "Bullet Damage", "icon": "💥"},
            "health": {"cost": 120, "level": 0, "max_level": 5, "description": "Max Health", "icon": "❤️"},
            "energy": {"cost": 100, "level": 0, "max_level": 4, "description": "Dash Energy", "icon": "⚡"},
        }
        upgrades_system.score_spent = 0
        enemies_to_spawn = 6
        spawned_this_wave = 0
        last_spawn = now
        wave_banner_until = pygame.time.get_ticks() + 1800
        state = "playing"

    while running:
        now = pygame.time.get_ticks()
        direction = (0, 0)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
                if state in {"menu", "game_over"} and event.key in {pygame.K_SPACE, pygame.K_RETURN}:
                    start_game()
                if state == "upgrades" and event.key in {pygame.K_SPACE, pygame.K_RETURN}:
                    enemies_to_spawn = 5 + wave * 2
                    spawned_this_wave = 0
                    last_spawn = now
                    wave_banner_until = now + 1800
                    state = "playing"
                    show_upgrades = False
                if state == "upgrades" and event.key == pygame.K_LEFT:
                    selected_upgrade = (selected_upgrade - 1) % len(upgrades_system.upgrades)
                if state == "upgrades" and event.key == pygame.K_RIGHT:
                    selected_upgrade = (selected_upgrade + 1) % len(upgrades_system.upgrades)
                if state == "playing" and event.key in {pygame.K_LSHIFT, pygame.K_RSHIFT}:
                    direction = player.update(pygame.key.get_pressed())
                    if player.dash(direction, now):
                        add_burst(particles, player.x, player.y, CYAN, 24)
            if event.type == pygame.MOUSEBUTTONDOWN:
                if state in {"menu", "game_over"}:
                    start_game()
                elif state == "upgrades":
                    # Handle upgrade button clicks
                    button_width = 220
                    button_height = 90
                    cols = 2
                    col_spacing = 280
                    row_spacing = 135
                    
                    grid_width = (cols - 1) * col_spacing + button_width
                    start_x = WIDTH // 2 - grid_width // 2
                    start_y = HEIGHT // 2 - 50
                    
                    mouse_pos = pygame.mouse.get_pos()
                    for idx, upgrade_type in enumerate(upgrades_system.upgrades.keys()):
                        col = idx % cols
                        row = idx // cols
                        
                        x = start_x + col * col_spacing
                        y = start_y + row * row_spacing
                        button_rect = pygame.Rect(x, y, button_width, button_height)
                        if button_rect.collidepoint(mouse_pos):
                            if upgrades_system.can_upgrade(upgrade_type, score):
                                upgrades_system.upgrade(upgrade_type)
                                # Apply upgrade effects to player
                                player.max_health = int(upgrades_system.get_upgrade_effect("health"))
                                player.max_energy = int(upgrades_system.get_upgrade_effect("energy"))
                                player.health = min(player.health, player.max_health)

        if state == "playing":
            keys = pygame.key.get_pressed()
            direction = player.update(keys)

            if (keys[pygame.K_SPACE] or pygame.mouse.get_pressed()[0]) and player.can_shoot(now):
                bullets.extend(player.shoot(now))
                add_burst(particles, player.x + math.cos(player.angle) * 18, player.y + math.sin(player.angle) * 18, CYAN, 8)

            if spawned_this_wave < enemies_to_spawn and now - last_spawn > max(220, 800 - wave * 40):
                enemies.append(spawn_enemy(wave))
                spawned_this_wave += 1
                last_spawn = now

            for enemy in enemies:
                bullets.extend(enemy.update(player, now))

            for bullet in bullets[:]:
                if not bullet.update():
                    bullets.remove(bullet)
                    continue

                if bullet.owner == "player":
                    hit = next((enemy for enemy in enemies if math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) < enemy.radius + bullet.radius), None)
                    if hit:
                        hit.health -= bullet.damage
                        add_burst(particles, bullet.x, bullet.y, hit.color, 10)
                        bullets.remove(bullet)
                        if hit.health <= 0:
                            score += hit.points
                            add_burst(particles, hit.x, hit.y, hit.color, 28)
                            if random.random() < 0.16:
                                kind_roll = random.random()
                                kind = "spread" if kind_roll < 0.45 else "heal" if kind_roll < 0.75 else "rapid"
                                powerups.append(Powerup(hit.x, hit.y, kind))
                            enemies.remove(hit)
                        continue
                else:
                    if math.hypot(player.x - bullet.x, player.y - bullet.y) < player.radius + bullet.radius and now >= player.invulnerable_until:
                        player.health -= 10 if bullet.color != YELLOW else 14
                        player.invulnerable_until = now + 450
                        add_burst(particles, player.x, player.y, RED, 18)
                        bullets.remove(bullet)
                        continue

            for enemy in enemies[:]:
                if math.hypot(player.x - enemy.x, player.y - enemy.y) < player.radius + enemy.radius and now >= player.invulnerable_until:
                    player.health -= 18
                    player.invulnerable_until = now + 600
                    add_burst(particles, player.x, player.y, RED, 24)
                    push_angle = math.atan2(player.y - enemy.y, player.x - enemy.x)
                    player.x += math.cos(push_angle) * 36
                    player.y += math.sin(push_angle) * 36

            for powerup in powerups[:]:
                if math.hypot(player.x - powerup.x, player.y - powerup.y) < player.radius + powerup.radius:
                    if powerup.kind == "spread":
                        player.weapon_level = min(4, player.weapon_level + 1)
                    elif powerup.kind == "heal":
                        player.health = min(player.max_health, player.health + 24)
                    else:
                        player.rapid_until = now + 6000
                    add_burst(particles, powerup.x, powerup.y, powerup.color, 18)
                    powerups.remove(powerup)

            if spawned_this_wave >= enemies_to_spawn and not enemies:
                wave += 1
                if wave % 3 == 0:
                    player.weapon_level = min(4, player.weapon_level + 1)
                state = "upgrades"
                show_upgrades = True

            if player.health <= 0:
                state = "game_over"

        for star in stars:
            star.update()
        for particle in particles[:]:
            particle.update()
            if particle.life <= 0:
                particles.remove(particle)

        draw_background()
        for star in stars:
            star.draw()

        for powerup in powerups:
            powerup.draw(now)
        for bullet in bullets:
            bullet.draw()
        for enemy in enemies:
            enemy.draw(now)
        if state == "playing":
            player.draw(now)

        particle_surface = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
        for particle in particles:
            particle.draw(particle_surface)
        screen.blit(particle_surface, (0, 0), special_flags=pygame.BLEND_RGBA_ADD)

        if state == "menu":
            draw_message(
                "GALAXY ARENA X",
                "Arena Shooter with Upgrades & Waves",
                "WASD/Arrows: Move | Mouse: Aim | Click/Space: Shoot | Shift: Dash",
                now
            )
        elif state == "game_over":
            draw_message("GAME OVER", f"Score: {score}", "Press SPACE to continue", now)
        elif state == "upgrades":
            draw_upgrades_menu(score, upgrades_system)
        else:
            enemies_left = max(0, enemies_to_spawn - spawned_this_wave) + len(enemies)
            draw_hud(player, score, wave, enemies_left, now, upgrades_system)
            if now < wave_banner_until:
                banner = font_main.render(f"WAVE {wave}", True, YELLOW)
                screen.blit(banner, banner.get_rect(center=(WIDTH // 2, 90)))
            if now < player.rapid_until:
                rapid_text = font_small.render("RAPID FIRE ACTIVE", True, PINK)
                screen.blit(rapid_text, rapid_text.get_rect(center=(WIDTH // 2, HEIGHT - 26)))

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()


if __name__ == "__main__":
    main()
