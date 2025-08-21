# PRINT QUEST — a tiny terminal roguelike (pure print + input)
# Controls: W/A/S/D to move, Q to quit
# Goal: collect all $ coins, then reach the E exit without touching monsters (M)

import random

W, H = 15, 10
WALLS = 22
COINS = 5
MONSTERS = 3

RESET = "\033[0m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
CYAN = "\033[96m"
WHITE = "\033[97m"


# helpers
def clear():
    # ANSI clear using print
    print("\033[2J\033[H", end="")


def in_bounds(x, y):
    return 0 <= x < W and 0 <= y < H


def neighbors_toward(src, dst):
    sx, sy = src
    dx, dy = dst
    opts = []
    if dx > sx:
        opts.append((sx + 1, sy))
    if dx < sx:
        opts.append((sx - 1, sy))
    if dy > sy:
        opts.append((sx, sy + 1))
    if dy < sy:
        opts.append((sx, sy - 1))
    # also allow small random wiggle
    random.shuffle(opts)
    return opts or [(sx, sy)]


# world gen
cells = {(x, y) for x in range(W) for y in range(H)}
rng = random.Random()

# choose exit in a corner
exit_pos = random.choice([(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)])

# player center-ish
player = (W // 2, H // 2)

occupied = {player, exit_pos}
walls = set()
while len(walls) < WALLS:
    p = (rng.randrange(W), rng.randrange(H))
    if p not in occupied and p not in {(1, 1), (W - 2, H - 2)}:
        walls.add(p)
occupied |= walls

coins = set()
while len(coins) < COINS:
    p = (rng.randrange(W), rng.randrange(H))
    if p not in occupied:
        coins.add(p)
occupied |= coins

monsters = []
while len(monsters) < MONSTERS:
    p = (rng.randrange(W), rng.randrange(H))
    if p not in occupied:
        monsters.append(p)
        occupied.add(p)

turn = 0
alive = True
won = False


def draw():
    clear()
    top = "PRINT QUEST  |  Coins left: {}  |  Turn: {}\n".format(len(coins), turn)
    print(top)
    # build a back buffer with chars
    grid = [[" ." for _ in range(W)] for _ in range(H)]
    for x, y in walls:
        grid[y][x] = WHITE + " #" + RESET
    for x, y in coins:
        grid[y][x] = YELLOW + " $" + RESET
    ex, ey = exit_pos  # exit drawn under player if same tile after win
    grid[ey][ex] = GREEN + " E" + RESET
    for mx, my in monsters:
        grid[my][mx] = RED + " M" + RESET
    px, py = player
    grid[py][px] = BLUE + " @" + RESET
    # border
    print("+" + "--" * W + "+")
    for y in range(H):
        print("|" + "".join(grid[y]) + " |")
    print("+" + "--" * W + "+")
    print("\nMove with W/A/S/D, Q to quit.")


def passable(p):
    return p not in walls and in_bounds(*p)


while alive and not won:
    draw()
    cmd = input("> ").strip().lower()[:1]
    if cmd == "q":
        break
    dx = dy = 0
    if cmd == "w":
        dy = -1
    elif cmd == "s":
        dy = 1
    elif cmd == "a":
        dx = -1
    elif cmd == "d":
        dx = 1
    else:
        print("Use W/A/S/D.")
        continue

    # player move
    nx, ny = player[0] + dx, player[1] + dy

    if (nx, ny) in monsters:
        clear()
        print("💀 You ran into a monster. RIP.")
        exit()

    if in_bounds(nx, ny) and (nx, ny) not in walls:
        player = (nx, ny)

    # coin pickup
    if player in coins:
        coins.remove(player)

    # monsters move (greedy step toward player, avoid walls if possible)
    new_monsters = []
    for m in monsters:
        opts = neighbors_toward(m, player)
        # prefer first legal option else stay
        moved = m
        for cand in opts:
            if (
                passable(cand)
                and cand != exit_pos
                and cand not in new_monsters
                and cand != player
            ):
                moved = cand
                break
        # small randomness if blocked
        if moved == m:
            rands = [
                (m[0] + dx, m[1] + dy) for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]
            ]
            rng.shuffle(rands)
            for cand in rands:
                if (
                    passable(cand)
                    and cand != exit_pos
                    and cand not in new_monsters
                    and cand != player
                ):
                    moved = cand
                    break
        new_monsters.append(moved)
    monsters = new_monsters

    # check loss
    if player in monsters:
        alive = False
        break

    # win if all coins collected and on exit
    if not coins and player == exit_pos:
        won = True
        break

    turn += 1

# end screen
clear()
if won:
    print("........????")
    # תוסיפו כאן הדפסה במקרה שהמשתמש מנצח
    # בונוס: תכניסו להדפסה את מספר הצעדים שהמשתמש ביצע במשחק
elif not alive:
    print("........????")
    # תוסיפו כאן הדפסה במקרה שהמשתמש נפסל כי נגע במפלצת
    # בונוס: תכניסו להדפסה את מספר הצעדים שהמשתמש ביצע במשחק
else:
    print("Bye! Come back soon.")
