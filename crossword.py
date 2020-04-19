from itertools import permutations


def preprocess_input(board):
    word_lengths = []
    intersections = []
    letters_by_word = []
    indexed_board = [letter for letter in board if letter != "\n"]
    for i in range(0, len(indexed_board), 10):
        in_word = False
        pairs = list(enumerate(indexed_board))[i:i+10]
        pairs.extend(list(enumerate(indexed_board))[i//10:91+i//10:10])
        for index, letter in pairs:
            if letter == "0" and in_word:
                in_word = False
                if word_lengths[-1] == 1:
                    word_lengths.pop()
                    letters_by_word.pop()
            elif letter == "1" and not in_word:
                in_word = True
                word_lengths.append(1)
                letters_by_word.append([index])
            elif letter == "1":
                word_lengths[-1] += 1
                letters_by_word[-1].append(index)
    for word in letters_by_word:
        intersections.append([])
        for local_letter_index, global_letter_index in enumerate(word):
            for word_index, another_word in enumerate(letters_by_word):
                if another_word is not word and global_letter_index in another_word:
                    intersections[-1].append((word_index, another_word.index(global_letter_index), local_letter_index))
    return word_lengths, intersections


def solve(board, letters):
    print(f"Attempting to solve with letters {letters}")
    word_lengths, intersections = preprocess_input(board)
    with open("words.txt", "r") as f:
        valid_words = f.read().splitlines()

    dictionary = []

    for i in range(len(letters) - 1):
        permutations_list = list(permutations(letters, i + 2))
        for p in permutations_list:
            candidate_word = "".join(p)
            if candidate_word in valid_words:
                dictionary.append(candidate_word)
    del permutations_list

    dictionary = list(dict.fromkeys(dictionary))

    candidate_solutions = [[None] * len(word_lengths)]
    solutions = []
    s = None

    while len(candidate_solutions) > 0 and len(solutions) <= 20:
        if s is not None and s in candidate_solutions:
            candidate_solutions.remove(s)

        s = candidate_solutions[0]

        if None not in s:
            solutions.append(s)
            candidate_solutions.remove(s)
            continue

        longest_index = 0
        for i in intersections[1:]:
            if s[intersections.index(i)] is None:
                if (
                    len(i) > len(intersections[longest_index])
                    or s[longest_index] is not None
                ):
                    longest_index = intersections.index(i)
                elif len(i) == len(intersections[longest_index]):
                    if (
                        word_lengths[intersections.index(i)]
                        > word_lengths[longest_index]
                    ):
                        longest_index = intersections.index(i)

        candidates = []
        for w in dictionary:
            if word_lengths[longest_index] == len(w):
                possible = True
                if possible:
                    for i in intersections[longest_index]:
                        if s[i[0]] is not None:
                            if s[i[0]][i[1]] == w[i[2]]:
                                possible = True
                            else:
                                possible = False
                                break
                        else:
                            for sw in dictionary:
                                if (
                                    len(sw) == word_lengths[i[0]]
                                    and sw[i[1]] == w[i[2]]
                                ):
                                    possible = True
                                    break
                                else:
                                    possible = False
                if possible:
                    candidates.append(w)

        for candidate in candidates:
            if candidate not in s:
                candidate_solutions.append(s.copy())
                candidate_solutions[-1][longest_index] = candidate

    return solutions
