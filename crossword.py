import enchant

def solve(letters, word_lengths, intersections):

    d = enchant.Dict("en_US")

    dictionary = []

    for i in range(len(letters) - 1):
        permutations_list = list(permutations(letters, i + 2))
        for p in permutations_list:
            candidate_word = ''.join(p)
            if d.check(candidate_word):
                dictionary.append(candidate_word)
    del permutations_list

    dictionary = list(dict.fromkeys(dictionary))

    candidate_solutions = [[None] * len(word_lengths)]
    solutions = []
    old_s = None

    while len(candidate_solutions) > 0:

        if old_s is not None and old_s in candidate_solutions:
            candidate_solutions.remove(old_s)

        s = candidate_solutions[0]

        if None not in s:
            solutions.append(s)
            candidate_solutions.remove(s)
            continue

        longest_index = 0
        for i in intersections[1:]:
            if s[intersections.index(i)] is None:
                if len(i) > len(intersections[longest_index]) or s[longest_index] is not None:
                    longest_index = intersections.index(i)
                elif len(i) == len(intersections[longest_index]):
                    if word_lengths[intersections.index(i)] > word_lengths[longest_index]:
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
                                if len(sw) == word_lengths[i[0]] and sw[i[1]] == w[i[2]]:
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

        old_s = s

    return solutions
