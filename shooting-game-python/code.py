from pygame import *
import random


init()

# The screen
screen = display.set_mode((800, 600))
display.set_caption("Space War")

background = image.load('project/background.png')

mixer.music.load("project/background.wav")
mixer.music.play(-1)


player_surf = image.load('project/player.png')
player_rect = Rect(370, 480, player_surf.get_width(), player_surf.get_height())

# Enemies
enemy_imgs = []
enemy_rects = []
enemyX_change = []
enemyY_change = 40
num_of_enemies = 6

for i in range(num_of_enemies):
    enemy_imgs.append(   image.load("project/enemy.png")   )
    one_rect = Rect(
        random.randint(0, 736), 
        random.randint(50, 150),
        enemy_imgs[-1].get_width(),
        enemy_imgs[-1].get_height(),
        )
    enemy_rects.append(one_rect)
    enemyX_change.append(24)    





bullet_surf = image.load('project/bullet.png')
bullet_rect = Rect(0, player_rect.y, bullet_surf.get_width(), bullet_surf.get_height())
bullet_state = "ready"

# Fonts
over_font = font.SysFont("Arial", 64)
score_font = font.SysFont("Arial", 32)

score_value = 0

running = True

clock = time.Clock()

while running:

    screen.blit(background, (0, 0))

    for e in event.get():
        if e.type == QUIT:
            running = False

        if e.type == KEYDOWN:
            if e.key == K_SPACE:
                if bullet_state == "ready":
                    bullet_rect.x = player_rect.x
                    bullet_state = "fire"    
                    bullet_sound = mixer.Sound("project/laser.wav")
                    bullet_sound.play()
        


    keys_pressed = key.get_pressed()
    if keys_pressed[K_LEFT]: 
         player_rect.x -= 25 
    if keys_pressed[K_RIGHT]:
        player_rect.x += 25

    if player_rect.x > 736:
        player_rect.x = 736
    if player_rect.x < 0:
        player_rect.x = 0


    # תכניסו את כל האויבים למסך!!!!!!!!
    for i in range(num_of_enemies):

        screen.blit(enemy_imgs[i], enemy_rects[i])
        
        enemy_rects[i].x += enemyX_change[i]

        # Move the enemies
        if enemy_rects[i].x > 736:
            enemyX_change[i] = -24
            enemy_rects[i].y += enemyY_change
        elif enemy_rects[i].x < 0:
            enemyX_change[i] = 24
            enemy_rects[i].y += enemyY_change
        # Move the enemies

        if enemy_rects[i].y > 440:
            for j in range(num_of_enemies):
                enemy_rects[j].y = 2000   
            over_text = over_font.render("GAME OVER", True, "red") 
            screen.blit(over_text, (200, 250))
            break

        if enemy_rects[i].colliderect(bullet_rect) and bullet_state == "fire":
            bullet_rect.y = player_rect.y 
            bullet_state = "ready"
            enemy_rects[i].x = random.randint(0, 736) 
            enemy_rects[i].y = random.randint(50, 150)
            score_value += 1
            explosion_sound = mixer.Sound("project/explosion.wav")
            explosion_sound.play()

    
    if bullet_rect.y < 0:
        bullet_rect.y = player_rect.y
        bullet_state = "ready"   


    if bullet_state == "fire":
        screen.blit(bullet_surf, (bullet_rect.x + 16, bullet_rect.y + 10))
        bullet_rect.y -= 40


    screen.blit(player_surf, player_rect)

    score = score_font.render("Score: " + str(score_value), True, "white")
    screen.blit(score, (10, 10))

    clock.tick(40)
    display.update()