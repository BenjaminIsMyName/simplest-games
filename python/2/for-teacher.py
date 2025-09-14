import sys
import random
import time
import math
import array

# ---------------------------
# Console setup (print + input + various variable types)
# ---------------------------

print("🎮 Welcome to COOL DODGER!")
player_name: str = input("What's your name? ").strip() or "Player"

# Difficulty as int
print("\nChoose difficulty (1=Easy, 2=Normal, 3=Hard, 4=Insane)")
try:
    difficulty: int = int(input("Difficulty [1-4]: ").strip() or "2")
    if difficulty not in (1, 2, 3, 4):
        raise ValueError
except ValueError:
    print("Invalid input. Setting difficulty to 2 (Normal).")
    difficulty = 2

# Volume as float (0.0 to 1.0)
try:
    volume: float = float(input("Volume (0.0 - 1.0) [e.g., 0.6]: ").strip() or "0.6")
    volume = max(0.0, min(1.0, volume))
except ValueError:
    print("Invalid input. Setting volume to 0.6.")
    volume = 0.6

# Bool for “color mode”
yn = input("Colorful mode? (y/n): ").strip().lower() or "y"
colorful_mode: bool = yn.startswith("y")

print("\nSummary:")
print(f"- Name (str): {player_name}")
print(f"- Difficulty (int): {difficulty}")
print(f"- Volume (float): {volume}")
print(f"- Colorful (bool): {colorful_mode}")
print("\nLaunching game... (arrow keys to move left/right, R to restart, Esc to quit)")
time.sleep(1)

# ---------------------------
# Game (Pygame)
# ---------------------------
try:
    import pygame
except ImportError:
    print("\nPygame is not installed. Run: pip install pygame")
    sys.exit(1)

pygame.init()
pygame.display.set_caption("Cool Dodger")

# Try to init audio (no external files, procedural beeps)
audio_ok = True
try:
    pygame.mixer.init(frequency=22050, size=-16, channels=1)
except Exception as e:
    print(f"(Audio disabled: {e})")
    audio_ok = False


def make_beep(frequency=440, duration_ms=200, vol=0.5):
    """Generate a beep sound in memory (no files)."""
    sample_rate = 22050
    n_samples = int(sample_rate * duration_ms / 1000)
    buf = array.array("h")  # signed 16-bit
    for i in range(n_samples):
        t = i / sample_rate
        val = int(vol * 32767 * math.sin(2 * math.pi * frequency * t))
        buf.append(val)
    snd = pygame.mixer.Sound(buffer=buf)
    snd.set_volume(vol)
    return snd


# Pre-make sounds with user volume
if audio_ok:
    hit_sound = make_beep(200, 250, volume)  # lower tone (collision)
    score_sound = make_beep(900, 120, volume)  # higher tone (milestones)

# Window & visuals
WIDTH, HEIGHT = 540, 720
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
FONT = pygame.font.SysFont(None, 28)
BIG = pygame.font.SysFont(None, 60)

# Player
player_w, player_h = 60, 18
player_x = WIDTH // 2 - player_w // 2
player_y = HEIGHT - 80

# Difficulty tuning
diff_speed = {
    1: (5, (4, 7), 900),
    2: (6, (5, 9), 750),
    3: (7, (7, 11), 600),
    4: (8, (9, 13), 480),
}
player_speed, (min_fall, max_fall), spawn_ms = diff_speed.get(difficulty, diff_speed[2])

# Colors
BG = (30, 30, 38)
PLAYER_COLOR = (80, 200, 255) if colorful_mode else (220, 220, 220)
OBST_COLORS = [
    (255, 105, 97),
    (97, 214, 214),
    (255, 179, 71),
    (144, 238, 144),
    (180, 132, 255),
]
OBST_COLOR = (255, 120, 120)

# Obstacles
obstacles = []  # list of dicts: {x,y,w,h,vy,color}
last_spawn = 0

# Score
score = 0
alive = True
start_time = pygame.time.get_ticks()
next_score_milestone = 100  # play a "ding" every 100 points


def spawn_obstacle():
    w = random.randint(40, 120)
    h = random.randint(12, 20)
    x = random.randint(0, WIDTH - w)
    y = -h
    vy = random.randint(min_fall, max_fall)
    color = random.choice(OBST_COLORS) if colorful_mode else OBST_COLOR
    obstacles.append({"x": x, "y": y, "w": w, "h": h, "vy": vy, "color": color})


def rects_collide(a, b):
    return (
        a["x"] < b["x"] + b["w"]
        and a["x"] + a["w"] > b["x"]
        and a["y"] < b["y"] + b["h"]
        and a["y"] + a["h"] > b["y"]
    )


def draw_text_center(text, font, color, y):
    surf = font.render(text, True, color)
    rect = surf.get_rect(center=(WIDTH // 2, y))
    screen.blit(surf, rect)


while True:
    dt = clock.tick(60)  # ms/frame
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit(0)
        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            pygame.quit()
            sys.exit(0)

    keys = pygame.key.get_pressed()
    if alive:
        # Movement
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            player_x -= player_speed
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            player_x += player_speed
        player_x = max(0, min(WIDTH - player_w, player_x))

        # Spawn obstacles
        now = pygame.time.get_ticks()
        if now - last_spawn > spawn_ms:
            spawn_obstacle()
            last_spawn = now

        # Move obstacles & remove off-screen
        for o in obstacles:
            o["y"] += o["vy"]
        obstacles = [o for o in obstacles if o["y"] < HEIGHT + 40]

        # Update score over time (scaled by difficulty)
        score += 0.05 * difficulty

        # Milestone sound
        if audio_ok and score >= next_score_milestone:
            score_sound.play()
            next_score_milestone += 100

        # Collision
        player_rect = {"x": player_x, "y": player_y, "w": player_w, "h": player_h}
        for o in obstacles:
            if rects_collide(player_rect, o):
                alive = False
                end_time = pygame.time.get_ticks()
                if audio_ok:
                    hit_sound.play()
                break

    else:
        # Restart with R
        if keys[pygame.K_r]:
            obstacles.clear()
            player_x = WIDTH // 2 - player_w // 2
            score = 0
            alive = True
            last_spawn = 0
            start_time = pygame.time.get_ticks()
            next_score_milestone = 100

    # Draw
    screen.fill(BG)
    pygame.draw.rect(
        screen, PLAYER_COLOR, (player_x, player_y, player_w, player_h), border_radius=6
    )
    for o in obstacles:
        pygame.draw.rect(
            screen, o["color"], (o["x"], o["y"], o["w"], o["h"]), border_radius=4
        )

    # HUD
    hud = FONT.render(
        f"{player_name} | Score: {int(score)} | Diff:{difficulty}",
        True,
        (240, 240, 255),
    )
    screen.blit(hud, (12, 10))

    if not alive:
        draw_text_center("GAME OVER", BIG, (250, 220, 230), HEIGHT // 2 - 20)
        draw_text_center(
            f"Final Score: {int(score)}", FONT, (230, 230, 255), HEIGHT // 2 + 24
        )
        draw_text_center(
            "Press R to restart, Esc to quit", FONT, (200, 200, 210), HEIGHT // 2 + 54
        )

    pygame.display.flip()
