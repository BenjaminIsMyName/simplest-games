from pygame import * # 1
import random # 49

init() # 2

# The screen
screen = display.set_mode((800, 600)) # 3
display.set_caption("Space War") # 10

# Background
background = image.load('project/background.png') # 11

# Background sound
mixer.music.load("project/background.wav") # 80
mixer.music.play() # 81 (for loop, pass -1 to the play() function)

# Player
player_surf = image.load('project/player.png') # 13
player_rect = Rect(370, 480, player_surf.get_width(), player_surf.get_height()) # 14

# Enemies
enemy_imgs = [] # 41 
enemy_rects = [] # 42
# Each one has its own direction, the movement for each can be 24 or -24
enemyX_change = [] # 43
# Everyone goes down 40, nothing goes up
enemyY_change = 40 # 44
num_of_enemies = 6 # 45

for i in range(num_of_enemies): # 46
    enemy_imgs.append(image.load('project/enemy.png')) # 47
    one_rect = Rect(random.randint(0, 736), random.randint(50, 150), # 48 (line 49 is the import)
                           enemy_imgs[-1].get_width(), enemy_imgs[-1].get_height()) # 50
    enemy_rects.append(one_rect) # 51
    enemyX_change.append(24) # 52
    pass # 53 (no need)


# Bullet
bullet_surf = image.load('project/bullet.png') # 27  
bullet_rect = Rect(0, player_rect.y, bullet_surf.get_width(), bullet_surf.get_height()) # 28
bullet_state = "ready" # 29

# Fonts
over_font = font.SysFont("Arial", 64) # 67
score_font = font.SysFont("Arial", 32) # 75

score_value = 0 # 76

clock = time.Clock() # 25

running = True # 4

while running: # 5

    # Insert background to screen 
    screen.blit(background, (0, 0)) # 12

    for e in event.get(): # 6
        # Detect if the user wants to quit the game
        if e.type == QUIT: # 7
            running = False # 8
        # If keystroke is pressed check if its the space key
        if e.type == KEYDOWN: # 30
            # Start shooting if SPACE was just pressed
            if e.key == K_SPACE: # 31
                # Only if not shooting already - start shooting
                if bullet_state == "ready": # 32
                    # Get the current x coordinate of the spaceship 
                    bullet_rect.x = player_rect.x # 33
                    # Start firing 
                    bullet_state = "fire" # 34
                    bullet_sound = mixer.Sound("project/laser.wav") # 82
                    bullet_sound.play() # 83

    keys_pressed = key.get_pressed() # 16
    if keys_pressed[K_LEFT]: # 17
        player_rect.x -= 25 # 18
    if keys_pressed[K_RIGHT]: # 19
        player_rect.x += 25 # 20

    if player_rect.x <= 0: # 21
        player_rect.x = 0 # 22
    elif player_rect.x >= 736: # 23
        player_rect.x = 736 # 24

    # Handle the enemies
    for i in range(num_of_enemies): # 54
        
        screen.blit(enemy_imgs[i], enemy_rects[i]) # 55

        # Move the enemies
        enemy_rects[i].x += enemyX_change[i] # 56
        if enemy_rects[i].x > 736: # 57    
            enemyX_change[i] = -24 # 58    
            enemy_rects[i].y += enemyY_change # 59   
        elif enemy_rects[i].x < 0: # 60    
            enemyX_change[i] = 24 # 61   
            enemy_rects[i].y += enemyY_change # 62   

        # Game Over
        if enemy_rects[i].y > 440: # 63
            for j in range(num_of_enemies): # 64
                enemy_rects[j].y = 2000 # 65
            over_text = over_font.render("GAME OVER", True, (255, 255, 255)) # 66 (line 67 is to create the font)
            screen.blit(over_text, (200, 250)) # 68
            # Break out of the outer loop (that handles the enemies)
            break # 69

        # Collision - the bullet fired and hit the enemy
        if enemy_rects[i].colliderect(bullet_rect) and bullet_state == "fire": # 70
            bullet_rect.y = player_rect.y # 71
            bullet_state = "ready" # 72
            # It's dead, so return the enemy to the starting point
            enemy_rects[i].x = random.randint(0, 736) # 73
            enemy_rects[i].y = random.randint(50, 150) # 74
            score_value += 1 # 79 (lines 75-79 are all for the score)
            explosion_sound = mixer.Sound("project/explosion.wav") # 84
            explosion_sound.play() # 85

    
    # If the bullet is far up, don't "blit" it anymore
    if bullet_rect.y < 0: # 38
        bullet_rect.y = player_rect.y # 39
        bullet_state = "ready" # 40

    # If the bullet is on its way
    if bullet_state == "fire": # 35
        screen.blit(bullet_surf, (bullet_rect.x + 16, bullet_rect.y + 10)) # 36
        bullet_rect.y -= 40 # 37
    
    screen.blit(player_surf, player_rect) # 15

    score = score_font.render("Score : " + str(score_value), True, "white") # 77
    screen.blit(score, (10, 10)) # 78

    clock.tick(40) # 26
    display.update() # 9