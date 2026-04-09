import time
import math
import random

# ==================================================
# 💻 שלב הטרמינל - שיעור 2: קלט (Input) ומשתנים
# ==================================================
print("=======================================")
print("🏑 NEON CYBER HOCKEY 🏑")
print("=======================================")
time.sleep(1)

player_name = input("Enter your Player Name: ")

print("\n--- HOCKEY PHYSICS SETUP ---")
try:
    paddle_size = int(input("Enter your Paddle Size (50=Pro, 120=Normal, 600=CHEATER!): "))
except:
    paddle_size = 120

try:
    puck_speed = int(input("Enter Puck Speed (10=Slow, 15=Fast, 30=LIGHTNING): "))
except:
    puck_speed = 15

print(f"\nSYSTEM: Welcome {player_name}. Initializing Arena...")
time.sleep(1)

# ==================================================
# 🎮 שלב המשחק - Pygame Action!
# ==================================================
import pygame

pygame.init()
pygame.mixer.init()

WIDTH, HEIGHT = 1000, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption(f"{player_name}'s Cyber Hockey")
clock = pygame.time.Clock()

# צבעים
BLACK = (10, 10, 15)
WHITE = (255, 255, 255)
NEON_BLUE = (0, 255, 255)
NEON_PINK = (255, 0, 255)
NEON_GREEN = (57, 255, 20)

# פונטים
try:
    font_score = pygame.font.SysFont("impact", 80)
    font_msg = pygame.font.SysFont("impact", 40)
except:
    font_score = pygame.font.SysFont(None, 80)
    font_msg = pygame.font.SysFont(None, 40)

# מחולל סאונד מובנה
def generate_sound(freq, duration, volume=0.1):
    try:
        sample_rate = 44100
        buffer = bytearray()
        for i in range(int(sample_rate * duration)):
            val = int(volume * 32767.0 * math.sin(2.0 * math.pi * freq * i / sample_rate))
            buffer.extend(val.to_bytes(2, byteorder='little', signed=True))
        return pygame.mixer.Sound(buffer=buffer)
    except: return None

snd_hit = generate_sound(600, 0.05, 0.1)
snd_wall = generate_sound(300, 0.05, 0.05)
snd_goal = generate_sound(150, 0.5, 0.3)

# ==========================================
# אובייקטים ומחלקות
# ==========================================
class Paddle:
    def __init__(self, x, color, size, is_ai=False):
        self.rect = pygame.Rect(x, HEIGHT//2 - size//2, 20, size)
        self.color = color
        self.is_ai = is_ai
        # מהירות הבוט הונמכה כדי לאפשר לשחקן לנצח!
        self.ai_speed = puck_speed * 0.55 

    def update(self, puck_x=None, puck_y=None):
        if self.is_ai and puck_y is not None and puck_x is not None:
            # התיקון: הבוט מגיב רק כשהדיסקית בחצי המגרש שלו (חצה את האמצע)
            if puck_x > WIDTH // 2:
                if self.rect.centery < puck_y - 10:
                    self.rect.y += self.ai_speed
                elif self.rect.centery > puck_y + 10:
                    self.rect.y -= self.ai_speed
            else:
                # כשהדיסקית אצל השחקן, הבוט פשוט חוזר לאמצע השער לאט
                if self.rect.centery < HEIGHT // 2 - 10:
                    self.rect.y += self.ai_speed * 0.5
                elif self.rect.centery > HEIGHT // 2 + 10:
                    self.rect.y -= self.ai_speed * 0.5
        else:
            # תנועת שחקן עם העכבר
            mouse_y = pygame.mouse.get_pos()[1]
            self.rect.centery = mouse_y

        # הגבלת תנועה בגבולות
        if self.rect.top < 0: self.rect.top = 0
        if self.rect.bottom > HEIGHT: self.rect.bottom = HEIGHT

    def draw(self, surface, shake_x, shake_y):
        draw_rect = self.rect.copy()
        draw_rect.x += shake_x
        draw_rect.y += shake_y
        pygame.draw.rect(surface, self.color, draw_rect, border_radius=10)
        pygame.draw.rect(surface, WHITE, draw_rect, 2, border_radius=10)

class Puck:
    def __init__(self):
        self.rect = pygame.Rect(WIDTH//2 - 15, HEIGHT//2 - 15, 30, 30)
        self.max_speed = 28 # מגבלת מהירות כדי שהדיסקית לא תעבור דרך קירות
        self.reset()

    def reset(self):
        self.rect.center = (WIDTH//2, HEIGHT//2)
        angle = random.choice([random.uniform(-0.5, 0.5), random.uniform(math.pi - 0.5, math.pi + 0.5)])
        self.dx = math.cos(angle) * puck_speed
        self.dy = math.sin(angle) * puck_speed

    def update(self):
        self.rect.x += self.dx
        self.rect.y += self.dy

        # קירות
        if self.rect.top <= 0 or self.rect.bottom >= HEIGHT:
            self.dy *= -1
            if snd_wall: snd_wall.play()
            return "wall"
        return None

    def draw(self, surface, shake_x, shake_y):
        pygame.draw.circle(surface, NEON_GREEN, (self.rect.centerx + shake_x, self.rect.centery + shake_y), 15)
        pygame.draw.circle(surface, WHITE, (self.rect.centerx + shake_x, self.rect.centery + shake_y), 15, 3)

class Particle:
    def __init__(self, x, y, color):
        self.x, self.y = x, y
        angle = random.uniform(0, math.pi * 2)
        speed = random.uniform(2, 8)
        self.dx = math.cos(angle) * speed
        self.dy = math.sin(angle) * speed
        self.size = random.uniform(3, 8)
        self.color = color
        self.life = 255

    def update(self):
        self.x += self.dx; self.y += self.dy
        self.size *= 0.95
        self.life -= 15
        return self.life <= 0

    def draw(self, surface, shake_x, shake_y):
        if self.life > 0:
            pygame.draw.circle(surface, self.color, (int(self.x + shake_x), int(self.y + shake_y)), int(self.size))

# ==========================================
# לולאת המשחק
# ==========================================
player = Paddle(30, NEON_BLUE, paddle_size, is_ai=False)
ai_opponent = Paddle(WIDTH - 50, NEON_PINK, 120, is_ai=True)
puck = Puck()

particles = []
score_player = 0
score_ai = 0
screen_shake = 0
goal_message = ""
goal_timer = 0

pygame.mouse.set_visible(False)
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if goal_timer == 0:
        player.update()
        # מעבירים לבוט גם את מיקום ה-X וגם ה-Y כדי שיידע אם הדיסקית בחצי שלו!
        ai_opponent.update(puck.rect.centerx, puck.rect.centery)
        bounce_event = puck.update()
        
        if bounce_event == "wall":
            for _ in range(5): particles.append(Particle(puck.rect.centerx, puck.rect.centery, WHITE))

        # התנגשות הדיסקית
        if puck.rect.colliderect(player.rect) and puck.dx < 0:
            puck.dx *= -1.08 # האצה קלה
            if abs(puck.dx) > puck.max_speed: puck.dx = -puck.max_speed
            puck.rect.left = player.rect.right
            
            # הוספת זוית מטורפת אם פוגעים בקצוות המחבט!
            hit_pos = (puck.rect.centery - player.rect.centery) / (player.rect.height / 2)
            puck.dy = hit_pos * abs(puck.dx) * 0.8
            
            if snd_hit: snd_hit.play()
            for _ in range(15): particles.append(Particle(puck.rect.centerx, puck.rect.centery, NEON_BLUE))
            screen_shake = 5

        if puck.rect.colliderect(ai_opponent.rect) and puck.dx > 0:
            puck.dx *= -1.08
            if abs(puck.dx) > puck.max_speed: puck.dx = puck.max_speed
            puck.rect.right = ai_opponent.rect.left
            
            hit_pos = (puck.rect.centery - ai_opponent.rect.centery) / (ai_opponent.rect.height / 2)
            puck.dy = hit_pos * abs(puck.dx) * 0.8
            
            if snd_hit: snd_hit.play()
            for _ in range(15): particles.append(Particle(puck.rect.centerx, puck.rect.centery, NEON_PINK))
            screen_shake = 5

        # בדיקת גולים
        if puck.rect.left < 0:
            score_ai += 1
            goal_message = f"OH NO! {player_name} missed the puck!"
            goal_timer = 120
            screen_shake = 20
            if snd_goal: snd_goal.play()
            puck.reset()
            
        elif puck.rect.right > WIDTH:
            score_player += 1
            # f-string שמחשב מהירות ב"קמש"
            goal_message = f"GOAL! {player_name} smashed it at {int(abs(puck.dx)*10)} km/h!"
            goal_timer = 120
            screen_shake = 20
            if snd_goal: snd_goal.play()
            puck.reset()

    else:
        goal_timer -= 1

    for p in particles[:]:
        if p.update(): particles.remove(p)

    shake_x = random.randint(-screen_shake, screen_shake) if screen_shake > 0 else 0
    shake_y = random.randint(-screen_shake, screen_shake) if screen_shake > 0 else 0
    if screen_shake > 0: screen_shake -= 1

    screen.fill(BLACK)
    pygame.draw.line(screen, (30, 30, 40), (WIDTH//2 + shake_x, 0), (WIDTH//2 + shake_x, HEIGHT), 4)
    pygame.draw.circle(screen, (30, 30, 40), (WIDTH//2 + shake_x, HEIGHT//2 + shake_y), 100, 4)

    p_score_surf = font_score.render(str(score_player), True, NEON_BLUE)
    ai_score_surf = font_score.render(str(score_ai), True, NEON_PINK)
    screen.blit(p_score_surf, (WIDTH//4 - p_score_surf.get_width()//2 + shake_x, 20 + shake_y))
    screen.blit(ai_score_surf, (3*WIDTH//4 - ai_score_surf.get_width()//2 + shake_x, 20 + shake_y))

    player.draw(screen, shake_x, shake_y)
    ai_opponent.draw(screen, shake_x, shake_y)
    for p in particles: p.draw(screen, shake_x, shake_y)
    puck.draw(screen, shake_x, shake_y)

    if goal_timer > 0:
        if (goal_timer // 10) % 2 == 0:
            msg_surf = font_msg.render(goal_message, True, NEON_GREEN)
            screen.blit(msg_surf, msg_surf.get_rect(center=(WIDTH//2 + shake_x, HEIGHT//2 + shake_y)))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()