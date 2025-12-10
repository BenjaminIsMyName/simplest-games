from pygame import * # 1

init() # 2

# The screen
screen = display.set_mode((800, 600)) # 3
display.set_caption("Space War") # 10

# Background
background = image.load('23/background.png') # 11

# Player
player_surf = image.load('23/player.png') # 13
player_rect = Rect(370, 480, player_surf.get_width(), player_surf.get_height()) # 14

# Bullet
bullet_surf = image.load('23/bullet.png') # 27
bullet_rect = Rect(0, player_rect.y, bullet_surf.get_width(), bullet_surf.get_height()) # 28
bullet_state = "ready" # 29

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

    keys_pressed = key.get_pressed() # 16
    if keys_pressed[K_LEFT]: # 17
        player_rect.x -= 25 # 18
    if keys_pressed[K_RIGHT]: # 19
        player_rect.x += 25 # 20

    if player_rect.x <= 0: # 21
        player_rect.x = 0 # 22
    elif player_rect.x >= 736: # 23
        player_rect.x = 736 # 24

    
    # If the bullet is far up, don't "blit" it anymore
    if bullet_rect.y < 0: # 38
        bullet_rect.y = player_rect.y # 39
        bullet_state = "ready" # 40

    # If the bullet is on its way
    if bullet_state == "fire": # 35
        screen.blit(bullet_surf, (bullet_rect.x + 16, bullet_rect.y + 10)) # 36
        bullet_rect.y -= 40 # 37
    
    screen.blit(player_surf, player_rect) # 15

    clock.tick(40) # 26
    display.update() # 9