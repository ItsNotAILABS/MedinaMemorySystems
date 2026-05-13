(* 𓂀 ZERO-COST OCAML FUNCTIONAL COST ENGINE 𓂀
   Pure functional approach to cost elimination
   Charter: ZCE-OCAML-001
   Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026 *)

(* ═══════════════════════════════════════════════════════════════════════════
   φ (GOLDEN RATIO) CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ *)

let phi = 1.618033988749895
let phi_inverse = 0.6180339887498949
let schumann_ms = 128
let cache_size = 65536
let batch_size = 162  (* ~PHI * 100 *)
let entry_value_size = 512

(* ═══════════════════════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════════ *)

type cache_entry = {
  key_hash: int64;
  value: bytes;
  timestamp: int64;
  valid: bool;
}

type cost_metrics = {
  mutable requests_processed: int64;
  mutable bytes_processed: int64;
  mutable cache_hits: int64;
  mutable cache_misses: int64;
  mutable heap_allocs_avoided: int64;
  mutable estimated_savings_microcents: int64;
}

type cost_report = {
  cache_hit_rate: float;
  cache_savings_usd: float;
  dedup_savings_usd: float;
  arena_savings_usd: float;
  total_savings_usd: float;
  phi_efficiency: float;
  batch_reduction: float;
}

type process_result =
  | Cached of bytes
  | Processed of bytes
  | Deduplicated
  | PassThrough

(* ═══════════════════════════════════════════════════════════════════════════
   φ-HARMONIC HASH FUNCTION
   ═══════════════════════════════════════════════════════════════════════════ *)

let fnv_offset = 0xcbf29ce484222325L
let fnv_prime = 0x100000001b3L

let phi_hash (key : bytes) : int64 =
  let hash = ref fnv_offset in
  Bytes.iter (fun byte ->
    hash := Int64.logxor !hash (Int64.of_int (Char.code byte));
    hash := Int64.mul !hash fnv_prime
  ) key;
  (* φ-based final mixing *)
  let h = !hash in
  let h = Int64.logxor h (Int64.shift_right_logical h 33) in
  let h = Int64.mul h (Int64.of_float (phi *. 1e18)) in
  Int64.logxor h (Int64.shift_right_logical h 29)

(* ═══════════════════════════════════════════════════════════════════════════
   IMMUTABLE CACHE MODULE (Hash Array Mapped Trie-like)
   ═══════════════════════════════════════════════════════════════════════════ *)

module ImmutableCache = struct
  module IntMap = Map.Make(Int64)

  type t = {
    entries: cache_entry IntMap.t;
    hits: int64;
    misses: int64;
    bytes_saved: int64;
  }

  let empty = {
    entries = IntMap.empty;
    hits = 0L;
    misses = 0L;
    bytes_saved = 0L;
  }

  let get (cache : t) (key : bytes) : t * bytes option =
    let hash = phi_hash key in
    let idx = Int64.rem hash (Int64.of_int cache_size) in
    match IntMap.find_opt idx cache.entries with
    | Some entry when entry.valid && entry.key_hash = hash ->
        let new_cache = {
          cache with
          hits = Int64.add cache.hits 1L;
          bytes_saved = Int64.add cache.bytes_saved (Int64.of_int (Bytes.length entry.value));
        } in
        (new_cache, Some entry.value)
    | _ ->
        ({ cache with misses = Int64.add cache.misses 1L }, None)

  let set (cache : t) (key : bytes) (value : bytes) : t =
    if Bytes.length value > entry_value_size then cache
    else
      let hash = phi_hash key in
      let idx = Int64.rem hash (Int64.of_int cache_size) in
      let entry = {
        key_hash = hash;
        value = value;
        timestamp = Int64.of_float (Unix.gettimeofday () *. 1000.0);
        valid = true;
      } in
      { cache with entries = IntMap.add idx entry cache.entries }

  let hit_rate (cache : t) : float =
    let total = Int64.add cache.hits cache.misses in
    if total = 0L then 0.0
    else Int64.to_float cache.hits /. Int64.to_float total

  let cost_savings (cache : t) : float =
    Int64.to_float cache.hits *. 0.0000005
end

(* ═══════════════════════════════════════════════════════════════════════════
   REQUEST DEDUPLICATOR (Immutable Set-based)
   ═══════════════════════════════════════════════════════════════════════════ *)

module Deduplicator = struct
  module Int64Set = Set.Make(Int64)

  type t = {
    inflight: Int64Set.t;
    deduplicated: int64;
  }

  let empty = {
    inflight = Int64Set.empty;
    deduplicated = 0L;
  }

  let check_and_mark (dedup : t) (hash : int64) : t * bool =
    if Int64Set.mem hash dedup.inflight then
      ({ dedup with deduplicated = Int64.add dedup.deduplicated 1L }, true)
    else
      ({ dedup with inflight = Int64Set.add hash dedup.inflight }, false)

  let complete (dedup : t) (hash : int64) : t =
    { dedup with inflight = Int64Set.remove hash dedup.inflight }

  let cost_savings (dedup : t) : float =
    Int64.to_float dedup.deduplicated *. 0.0000005
end

(* ═══════════════════════════════════════════════════════════════════════════
   φ-BATCH PROCESSOR (Immutable List-based)
   ═══════════════════════════════════════════════════════════════════════════ *)

module BatchProcessor = struct
  type t = {
    items: bytes list;
    batches_processed: int;
  }

  let empty = {
    items = [];
    batches_processed = 0;
  }

  let add (bp : t) (item : bytes) : t * bytes list option =
    let new_items = item :: bp.items in
    if List.length new_items >= batch_size then
      let batch = List.rev new_items in
      ({ items = []; batches_processed = bp.batches_processed + 1 }, Some batch)
    else
      ({ bp with items = new_items }, None)

  let flush (bp : t) : t * bytes list =
    let batch = List.rev bp.items in
    ({ items = []; batches_processed = bp.batches_processed + 1 }, batch)

  let cost_reduction (bp : t) : float =
    if bp.batches_processed = 0 then 0.0
    else
      let individual_cost = float_of_int batch_size *. 0.0000005 in
      let batch_cost = 0.0005 in
      (individual_cost -. batch_cost) /. individual_cost
end

(* ═══════════════════════════════════════════════════════════════════════════
   COST METRICS
   ═══════════════════════════════════════════════════════════════════════════ *)

let create_metrics () = {
  requests_processed = 0L;
  bytes_processed = 0L;
  cache_hits = 0L;
  cache_misses = 0L;
  heap_allocs_avoided = 0L;
  estimated_savings_microcents = 0L;
}

let record_cache_hit (metrics : cost_metrics) =
  metrics.cache_hits <- Int64.add metrics.cache_hits 1L;
  metrics.estimated_savings_microcents <- 
    Int64.add metrics.estimated_savings_microcents 50L

let record_alloc_avoided (metrics : cost_metrics) (bytes : int) =
  metrics.heap_allocs_avoided <- Int64.add metrics.heap_allocs_avoided 1L;
  metrics.estimated_savings_microcents <- 
    Int64.add metrics.estimated_savings_microcents (Int64.of_int (bytes / 100))

let total_savings_usd (metrics : cost_metrics) : float =
  Int64.to_float metrics.estimated_savings_microcents /. 1000000.0

let phi_efficiency (metrics : cost_metrics) : float =
  let total = Int64.add metrics.cache_hits metrics.cache_misses in
  if total = 0L then 0.0
  else
    let hit_rate = Int64.to_float metrics.cache_hits /. Int64.to_float total in
    hit_rate *. phi_inverse +. (1.0 -. hit_rate) *. 0.1

(* ═══════════════════════════════════════════════════════════════════════════
   FUNCTIONAL COST ENGINE (Pure Immutable State)
   ═══════════════════════════════════════════════════════════════════════════ *)

module FunctionalCostEngine = struct
  type state = {
    cache: ImmutableCache.t;
    deduplicator: Deduplicator.t;
    batch_processor: BatchProcessor.t;
    requests_processed: int64;
    bytes_processed: int64;
  }

  let create () = {
    cache = ImmutableCache.empty;
    deduplicator = Deduplicator.empty;
    batch_processor = BatchProcessor.empty;
    requests_processed = 0L;
    bytes_processed = 0L;
  }

  let process (state : state) (path : bytes) (body : bytes) : state * process_result =
    let state = {
      state with
      requests_processed = Int64.add state.requests_processed 1L;
      bytes_processed = Int64.add state.bytes_processed (Int64.of_int (Bytes.length body));
    } in

    (* Check cache first *)
    let (new_cache, cached) = ImmutableCache.get state.cache path in
    let state = { state with cache = new_cache } in

    match cached with
    | Some value -> (state, Cached value)
    | None ->
        (* Check for duplicate *)
        let hash = phi_hash path in
        let (new_dedup, is_dup) = Deduplicator.check_and_mark state.deduplicator hash in
        let state = { state with deduplicator = new_dedup } in

        if is_dup then
          (state, Deduplicated)
        else
          (* Process and update cache *)
          let new_cache = ImmutableCache.set state.cache path body in
          let new_dedup = Deduplicator.complete state.deduplicator hash in
          let state = { state with cache = new_cache; deduplicator = new_dedup } in
          (state, Processed body)

  let cost_report (state : state) : cost_report = {
    cache_hit_rate = ImmutableCache.hit_rate state.cache;
    cache_savings_usd = ImmutableCache.cost_savings state.cache;
    dedup_savings_usd = Deduplicator.cost_savings state.deduplicator;
    arena_savings_usd = 0.0;  (* Pure functional - no arena needed *)
    total_savings_usd = 
      ImmutableCache.cost_savings state.cache +. 
      Deduplicator.cost_savings state.deduplicator;
    phi_efficiency = 
      let total = Int64.add state.cache.hits state.cache.misses in
      if total = 0L then 0.0
      else
        let hit_rate = Int64.to_float state.cache.hits /. Int64.to_float total in
        hit_rate *. phi_inverse +. (1.0 -. hit_rate) *. 0.1;
    batch_reduction = BatchProcessor.cost_reduction state.batch_processor;
  }
end

(* ═══════════════════════════════════════════════════════════════════════════
   φ-HARMONIC PREDICTOR (Purely Functional)
   ═══════════════════════════════════════════════════════════════════════════ *)

module PhiPredictor = struct
  let window_size = int_of_float (phi *. 100.0)

  type t = {
    history: float list;
    weights: float array;
  }

  let create () =
    let weights = Array.init window_size (fun i ->
      phi_inverse ** (float_of_int (window_size - i - 1))
    ) in
    let total = Array.fold_left (+.) 0.0 weights in
    let normalized = Array.map (fun w -> w /. total) weights in
    { history = []; weights = normalized }

  let add_sample (pred : t) (sample : float) : t =
    let history = 
      if List.length pred.history >= window_size then
        sample :: (List.rev (List.tl (List.rev pred.history)))
      else
        sample :: pred.history
    in
    { pred with history }

  let predict (pred : t) : float =
    if List.length pred.history < 3 then 0.0
    else
      let history = List.rev pred.history in
      let n = List.length history in
      let weights = Array.sub pred.weights (window_size - n) n in
      let total_weight = Array.fold_left (+.) 0.0 weights in
      let normalized = Array.map (fun w -> w /. total_weight) weights in
      List.mapi (fun i h -> h *. normalized.(i)) history
      |> List.fold_left (+.) 0.0

  let confidence (pred : t) : float =
    if List.length pred.history < 10 then 0.0
    else
      let history = pred.history in
      let n = float_of_int (List.length history) in
      let mean = List.fold_left (+.) 0.0 history /. n in
      let variance = 
        List.map (fun x -> (x -. mean) ** 2.0) history
        |> List.fold_left (+.) 0.0
        |> fun v -> v /. n
      in
      let cv = sqrt variance /. (abs_float mean +. 1e-10) in
      max 0.0 (min 1.0 (1.0 -. cv *. phi_inverse))
end

(* ═══════════════════════════════════════════════════════════════════════════
   MONADIC COST COMPUTATION
   ═══════════════════════════════════════════════════════════════════════════ *)

module CostMonad = struct
  type 'a t = FunctionalCostEngine.state -> FunctionalCostEngine.state * 'a

  let return (x : 'a) : 'a t = fun state -> (state, x)

  let bind (m : 'a t) (f : 'a -> 'b t) : 'b t = fun state ->
    let (state', a) = m state in
    f a state'

  let (>>=) = bind

  let get_state : FunctionalCostEngine.state t = fun state -> (state, state)

  let put_state (new_state : FunctionalCostEngine.state) : unit t = 
    fun _ -> (new_state, ())

  let process_request path body =
    get_state >>= fun state ->
    let (new_state, result) = FunctionalCostEngine.process state path body in
    put_state new_state >>= fun () ->
    return result

  let run (computation : 'a t) (initial_state : FunctionalCostEngine.state) =
    computation initial_state
end

(* ═══════════════════════════════════════════════════════════════════════════
   MAIN / TESTS
   ═══════════════════════════════════════════════════════════════════════════ *)

let () =
  print_endline "𓂀 Functional Cost Engine - OCaml Implementation 𓂀";
  print_endline (String.make 60 '=');

  (* Test hash *)
  let hash = phi_hash (Bytes.of_string "test_key") in
  Printf.printf "Hash of 'test_key': %Ld\n" hash;

  (* Test immutable cache *)
  let cache = ImmutableCache.empty in
  let cache = ImmutableCache.set cache 
    (Bytes.of_string "test_key") 
    (Bytes.of_string "test_value") in
  let (cache, result) = ImmutableCache.get cache (Bytes.of_string "test_key") in
  (match result with
   | Some v -> Printf.printf "Cache test: %s\n" (Bytes.to_string v)
   | None -> print_endline "Cache miss");
  Printf.printf "Cache hit rate: %f\n" (ImmutableCache.hit_rate cache);

  (* Test main engine *)
  let engine = FunctionalCostEngine.create () in
  let (engine, result) = FunctionalCostEngine.process engine
    (Bytes.of_string "/api/test")
    (Bytes.of_string "body content") in
  
  (match result with
   | Cached _ -> print_endline "Process result: Cached"
   | Processed _ -> print_endline "Process result: Processed"
   | Deduplicated -> print_endline "Process result: Deduplicated"
   | PassThrough -> print_endline "Process result: PassThrough");

  (* Generate report *)
  let report = FunctionalCostEngine.cost_report engine in
  print_endline "\n📊 Cost Report:";
  Printf.printf "  Cache Hit Rate: %.2f%%\n" (report.cache_hit_rate *. 100.0);
  Printf.printf "  Cache Savings: $%f\n" report.cache_savings_usd;
  Printf.printf "  φ-Efficiency: %.4f\n" report.phi_efficiency;
  Printf.printf "  Total Savings: $%f\n" report.total_savings_usd
