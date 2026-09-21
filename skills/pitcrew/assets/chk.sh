# chk.sh — gate checks for one Pitcrew task.
#
# Source this from the task's check script, declare how many checks that script
# runs, run them, then call chk_summary. Exit status 0 means every declared
# check ran and none failed or remained open.

CHK_RAN=0
CHK_FAILED=0
CHK_ASKED=0
CHK_EXPECTED=-1

# chk_expect <n> — how many chk/chk_absent/ask calls this script makes.
# Without it a script that returns early, or skips a block, reports clean.
chk_expect() {
  CHK_EXPECTED=$1
}

_chk_fail() {
  CHK_FAILED=$((CHK_FAILED + 1))
  printf 'FAIL %s  %s\n       %s\n' "$1" "$2" "$3"
  return 1
}

# chk <id> <label> <path> <pattern> — pattern must match in path.
chk() {
  CHK_RAN=$((CHK_RAN + 1))
  [ -e "$3" ] || { _chk_fail "$1" "$2" "no such file: $3"; return 1; }
  grep -qE -- "$4" "$3" 2>/dev/null && return 0
  _chk_fail "$1" "$2" "no match in $3 for: $4"
}

# chk_absent <id> <label> <path> <pattern> — pattern must not match in path.
# A path that does not exist satisfies it; say so in the label if that matters.
chk_absent() {
  CHK_RAN=$((CHK_RAN + 1))
  [ -e "$3" ] || return 0
  grep -qE -- "$4" "$3" 2>/dev/null || return 0
  _chk_fail "$1" "$2" "still present in $3: $4"
}

# ask <id> <question> — only a human can settle this. Counts as open.
# The question must stand alone: whoever reads it sees this line and nothing else.
ask() {
  CHK_RAN=$((CHK_RAN + 1))
  CHK_ASKED=$((CHK_ASKED + 1))
  printf 'ASK  %s  %s\n' "$1" "$2"
}

chk_summary() {
  _chk_short=0
  if [ "$CHK_EXPECTED" -ge 0 ] && [ "$CHK_RAN" -ne "$CHK_EXPECTED" ]; then
    _chk_short=1
    printf 'FAIL --   ran %s of %s declared checks; the rest never executed\n' \
      "$CHK_RAN" "$CHK_EXPECTED"
  fi
  printf 'CHK-DONE fail=%s ask=%s ran=%s\n' "$CHK_FAILED" "$CHK_ASKED" "$CHK_RAN"
  [ "$CHK_FAILED" -eq 0 ] && [ "$CHK_ASKED" -eq 0 ] && [ "$_chk_short" -eq 0 ]
}
