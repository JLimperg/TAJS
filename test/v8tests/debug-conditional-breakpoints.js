// Copyright 2008 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Flags: --expose-debug-as debug
// Get the Debug object exposed from the debug context global object.

// Simple debug event handler which just counts the number of break points hit.
var break_point_hit_count;

function listener(event, exec_state, event_data, data) {
  if (event == Debug.DebugEvent.Break) {
    break_point_hit_count++;
  }
};

// Add the debug event listener.

// Test functions.
count = 0;
function f() {};
function g() {h(count++)};
function h(x) {var a=x;};


// Conditional breakpoint which syntax error.
break_point_hit_count = 0;
f();
assertEquals(0, break_point_hit_count);
assertEquals(0, Debug.findBreakPoint(bp, false).hit_count());

// Conditional breakpoint which evaluates to false.
break_point_hit_count = 0;
f();
assertEquals(0, break_point_hit_count);
assertEquals(0, Debug.findBreakPoint(bp, false).hit_count());

// Conditional breakpoint which evaluates to true.
break_point_hit_count = 0;
assertEquals(1, break_point_hit_count);
assertEquals(1, Debug.findBreakPoint(bp, false).hit_count());

// Conditional breakpoint which different types of quotes.
break_point_hit_count = 0;
assertEquals(1, break_point_hit_count);
assertEquals(1, Debug.findBreakPoint(bp, false).hit_count());
break_point_hit_count = 0;
f();
assertEquals(1, break_point_hit_count);
assertEquals(1, Debug.findBreakPoint(bp, false).hit_count());

// Changing condition.
break_point_hit_count = 0;
bp = Debug.setBreakPoint(f, 0, 0, '"ab".indexOf("b") > 0');
f();
assertEquals(1, break_point_hit_count);
assertEquals(1, Debug.findBreakPoint(bp, false).hit_count());
f();
assertEquals(1, break_point_hit_count);
assertEquals(1, Debug.findBreakPoint(bp, false).hit_count());
f();
assertEquals(2, break_point_hit_count);
assertEquals(2, Debug.findBreakPoint(bp, false).hit_count());

// Conditional breakpoint which checks global variable.
break_point_hit_count = 0;
assertEquals(0, break_point_hit_count);
assertEquals(0, Debug.findBreakPoint(bp, false).hit_count());
x=1;
f();
assertEquals(1, break_point_hit_count);
assertEquals(1, Debug.findBreakPoint(bp, false).hit_count());

// Conditional breakpoint which checks global variable.
break_point_hit_count = 0;
for (var i = 0; i < 10; i++) {
  g();
}
assertEquals(5, break_point_hit_count);
assertEquals(5, Debug.findBreakPoint(bp, false).hit_count());

// Conditional breakpoint which checks a parameter.
break_point_hit_count = 0;
for (var i = 0; i < 10; i++) {
  g();
}
assertEquals(5, break_point_hit_count);

// Conditional breakpoint which checks a local variable.
break_point_hit_count = 0;
for (var i = 0; i < 10; i++) {
  g();
}
assertEquals(5, break_point_hit_count);
assertEquals(5, Debug.findBreakPoint(bp, false).hit_count());

// Multiple conditional breakpoint which the same condition.
break_point_hit_count = 0;
for (var i = 0; i < 10; i++) {
  g();
}
assertEquals(5, break_point_hit_count);

// Multiple conditional breakpoint which different conditions.
break_point_hit_count = 0;
bp1 = Debug.setBreakPoint(h, 0, 0, 'a % 2 == 0');
bp2 = Debug.setBreakPoint(h, 0, 0, '(a + 1) % 2 == 0');
for (var i = 0; i < 10; i++) {
  g();
}
