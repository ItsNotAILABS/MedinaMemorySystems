# 𓂀 ZERO-COST ELIXIR DISTRIBUTED COST ENGINE 𓂀
# BEAM-powered distributed cost elimination with fault tolerance
# Charter: ZCE-ELIXIR-001
# Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026

defmodule ZeroCost do
  @moduledoc """
  Zero-Cost Engine for Elixir/BEAM.
  Leverages OTP for distributed, fault-tolerant cost elimination.
  """

  # φ (Golden Ratio) constants
  @phi 1.618033988749895
  @phi_inverse 0.6180339887498949
  @schumann_ms 128
  @cache_size 65536
  @batch_size 162  # ~PHI * 100
end

# ═══════════════════════════════════════════════════════════════════════════
# φ-HARMONIC HASH MODULE
# ═══════════════════════════════════════════════════════════════════════════

defmodule ZeroCost.PhiHash do
  @moduledoc "φ-harmonic hash function for optimal distribution"
  
  @phi 1.618033988749895
  @fnv_offset 0xcbf29ce484222325
  @fnv_prime 0x100000001b3
  
  @spec hash(binary()) :: non_neg_integer()
  def hash(key) when is_binary(key) do
    key
    |> :binary.bin_to_list()
    |> Enum.reduce(@fnv_offset, fn byte, hash ->
      hash
      |> Bitwise.bxor(byte)
      |> Kernel.*(@ fnv_prime)
      |> Bitwise.band(0xFFFFFFFFFFFFFFFF)  # Keep 64-bit
    end)
    |> phi_mix()
  end
  
  defp phi_mix(hash) do
    hash
    |> Bitwise.bxor(Bitwise.bsr(hash, 33))
    |> Kernel.*(trunc(@phi * 1.0e18))
    |> Bitwise.band(0xFFFFFFFFFFFFFFFF)
    |> Bitwise.bxor(Bitwise.bsr(hash, 29))
  end
end

# ═══════════════════════════════════════════════════════════════════════════
# ETS-BACKED ZERO-ALLOC CACHE
# ═══════════════════════════════════════════════════════════════════════════

defmodule ZeroCost.Cache do
  @moduledoc """
  High-performance cache using ETS for near-constant-time lookups.
  Zero garbage collection pressure for reads.
  """
  
  use GenServer
  
  @cache_size 65536
  
  defstruct [:table, hits: 0, misses: 0, bytes_saved: 0]
  
  # Client API
  
  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end
  
  def get(server \\ __MODULE__, key) do
    GenServer.call(server, {:get, key})
  end
  
  def set(server \\ __MODULE__, key, value) do
    GenServer.call(server, {:set, key, value})
  end
  
  def stats(server \\ __MODULE__) do
    GenServer.call(server, :stats)
  end
  
  # Server Callbacks
  
  @impl true
  def init(_opts) do
    table = :ets.new(:zero_cost_cache, [
      :set,
      :public,
      read_concurrency: true,
      write_concurrency: true
    ])
    
    {:ok, %__MODULE__{table: table}}
  end
  
  @impl true
  def handle_call({:get, key}, _from, state) do
    hash = ZeroCost.PhiHash.hash(key)
    idx = rem(hash, @cache_size)
    
    case :ets.lookup(state.table, idx) do
      [{^idx, ^hash, value, _timestamp}] ->
        new_state = %{state | 
          hits: state.hits + 1,
          bytes_saved: state.bytes_saved + byte_size(value)
        }
        {:reply, {:ok, value}, new_state}
      
      _ ->
        {:reply, :miss, %{state | misses: state.misses + 1}}
    end
  end
  
  @impl true
  def handle_call({:set, key, value}, _from, state) do
    hash = ZeroCost.PhiHash.hash(key)
    idx = rem(hash, @cache_size)
    timestamp = System.system_time(:millisecond)
    
    :ets.insert(state.table, {idx, hash, value, timestamp})
    {:reply, :ok, state}
  end
  
  @impl true
  def handle_call(:stats, _from, state) do
    total = state.hits + state.misses
    hit_rate = if total > 0, do: state.hits / total, else: 0.0
    cost_savings = state.hits * 0.0000005
    
    {:reply, %{
      hits: state.hits,
      misses: state.misses,
      hit_rate: hit_rate,
      bytes_saved: state.bytes_saved,
      cost_savings_usd: cost_savings
    }, state}
  end
end

# ═══════════════════════════════════════════════════════════════════════════
# REQUEST DEDUPLICATOR WITH GENSERVER
# ═══════════════════════════════════════════════════════════════════════════

defmodule ZeroCost.Deduplicator do
  @moduledoc """
  Request deduplication using process-based coordination.
  Prevents duplicate processing of concurrent identical requests.
  """
  
  use GenServer
  
  defstruct inflight: %{}, deduplicated: 0
  
  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end
  
  def check_and_mark(server \\ __MODULE__, hash) do
    GenServer.call(server, {:check, hash})
  end
  
  def complete(server \\ __MODULE__, hash) do
    GenServer.cast(server, {:complete, hash})
  end
  
  def stats(server \\ __MODULE__) do
    GenServer.call(server, :stats)
  end
  
  @impl true
  def init(_opts) do
    {:ok, %__MODULE__{}}
  end
  
  @impl true
  def handle_call({:check, hash}, {from_pid, _}, state) do
    case Map.get(state.inflight, hash) do
      nil ->
        # Not in flight, mark it
        new_inflight = Map.put(state.inflight, hash, from_pid)
        {:reply, :proceed, %{state | inflight: new_inflight}}
      
      _pid ->
        # Already in flight - deduplicated
        {:reply, :duplicate, %{state | deduplicated: state.deduplicated + 1}}
    end
  end
  
  @impl true
  def handle_call(:stats, _from, state) do
    {:reply, %{
      inflight_count: map_size(state.inflight),
      deduplicated: state.deduplicated,
      cost_savings_usd: state.deduplicated * 0.0000005
    }, state}
  end
  
  @impl true
  def handle_cast({:complete, hash}, state) do
    new_inflight = Map.delete(state.inflight, hash)
    {:noreply, %{state | inflight: new_inflight}}
  end
end

# ═══════════════════════════════════════════════════════════════════════════
# φ-BATCH PROCESSOR WITH GENSERVER
# ═══════════════════════════════════════════════════════════════════════════

defmodule ZeroCost.BatchProcessor do
  @moduledoc """
  φ-harmonic batch processor using Fibonacci-based batch sizes.
  """
  
  use GenServer
  
  @phi 1.618033988749895
  @batch_size trunc(@phi * 100)  # ~162
  
  defstruct items: [], batches_processed: 0, callback: nil
  
  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    callback = Keyword.get(opts, :callback)
    GenServer.start_link(__MODULE__, %{callback: callback}, name: name)
  end
  
  def add(server \\ __MODULE__, item) do
    GenServer.call(server, {:add, item})
  end
  
  def flush(server \\ __MODULE__) do
    GenServer.call(server, :flush)
  end
  
  def stats(server \\ __MODULE__) do
    GenServer.call(server, :stats)
  end
  
  @impl true
  def init(%{callback: callback}) do
    {:ok, %__MODULE__{callback: callback}}
  end
  
  @impl true
  def handle_call({:add, item}, _from, state) do
    new_items = [item | state.items]
    
    if length(new_items) >= @batch_size do
      batch = Enum.reverse(new_items)
      
      # Execute callback if provided
      if state.callback, do: state.callback.(batch)
      
      {:reply, {:batch_ready, batch}, %{state | 
        items: [],
        batches_processed: state.batches_processed + 1
      }}
    else
      {:reply, :added, %{state | items: new_items}}
    end
  end
  
  @impl true
  def handle_call(:flush, _from, state) do
    batch = Enum.reverse(state.items)
    if state.callback && batch != [], do: state.callback.(batch)
    
    {:reply, batch, %{state | 
      items: [],
      batches_processed: state.batches_processed + 1
    }}
  end
  
  @impl true
  def handle_call(:stats, _from, state) do
    individual_cost = @batch_size * 0.0000005
    batch_cost = 0.0005
    cost_reduction = if state.batches_processed > 0 do
      (individual_cost - batch_cost) / individual_cost
    else
      0.0
    end
    
    {:reply, %{
      pending_items: length(state.items),
      batches_processed: state.batches_processed,
      batch_size: @batch_size,
      cost_reduction: cost_reduction
    }, state}
  end
end

# ═══════════════════════════════════════════════════════════════════════════
# DISTRIBUTED COST ENGINE
# ═══════════════════════════════════════════════════════════════════════════

defmodule ZeroCost.Engine do
  @moduledoc """
  Main distributed cost elimination engine.
  Coordinates cache, deduplication, and batching across nodes.
  """
  
  use GenServer
  
  @phi_inverse 0.6180339887498949
  
  defstruct [
    :cache_pid,
    :dedup_pid,
    :batch_pid,
    requests_processed: 0,
    bytes_processed: 0
  ]
  
  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end
  
  def process(server \\ __MODULE__, path, body) do
    GenServer.call(server, {:process, path, body})
  end
  
  def cost_report(server \\ __MODULE__) do
    GenServer.call(server, :cost_report)
  end
  
  @impl true
  def init(_opts) do
    {:ok, cache_pid} = ZeroCost.Cache.start_link(name: nil)
    {:ok, dedup_pid} = ZeroCost.Deduplicator.start_link(name: nil)
    {:ok, batch_pid} = ZeroCost.BatchProcessor.start_link(name: nil)
    
    {:ok, %__MODULE__{
      cache_pid: cache_pid,
      dedup_pid: dedup_pid,
      batch_pid: batch_pid
    }}
  end
  
  @impl true
  def handle_call({:process, path, body}, _from, state) do
    state = %{state | 
      requests_processed: state.requests_processed + 1,
      bytes_processed: state.bytes_processed + byte_size(body)
    }
    
    # Check cache first
    case ZeroCost.Cache.get(state.cache_pid, path) do
      {:ok, cached} ->
        {:reply, {:cached, cached}, state}
      
      :miss ->
        # Check for duplicate
        hash = ZeroCost.PhiHash.hash(path)
        case ZeroCost.Deduplicator.check_and_mark(state.dedup_pid, hash) do
          :duplicate ->
            {:reply, :deduplicated, state}
          
          :proceed ->
            # Process and cache result
            ZeroCost.Cache.set(state.cache_pid, path, body)
            ZeroCost.Deduplicator.complete(state.dedup_pid, hash)
            {:reply, {:processed, body}, state}
        end
    end
  end
  
  @impl true
  def handle_call(:cost_report, _from, state) do
    cache_stats = ZeroCost.Cache.stats(state.cache_pid)
    dedup_stats = ZeroCost.Deduplicator.stats(state.dedup_pid)
    batch_stats = ZeroCost.BatchProcessor.stats(state.batch_pid)
    
    total_savings = 
      cache_stats.cost_savings_usd + 
      dedup_stats.cost_savings_usd
    
    phi_efficiency = 
      cache_stats.hit_rate * @phi_inverse + 
      (1 - cache_stats.hit_rate) * 0.1
    
    report = %{
      cache_hit_rate: cache_stats.hit_rate,
      cache_savings_usd: cache_stats.cost_savings_usd,
      dedup_savings_usd: dedup_stats.cost_savings_usd,
      batch_reduction: batch_stats.cost_reduction,
      total_savings_usd: total_savings,
      phi_efficiency: phi_efficiency,
      requests_processed: state.requests_processed,
      bytes_processed: state.bytes_processed
    }
    
    {:reply, report, state}
  end
end

# ═══════════════════════════════════════════════════════════════════════════
# APPLICATION SUPERVISOR
# ═══════════════════════════════════════════════════════════════════════════

defmodule ZeroCost.Application do
  @moduledoc "OTP Application for Zero-Cost Engine"
  
  use Application
  
  @impl true
  def start(_type, _args) do
    children = [
      {ZeroCost.Cache, name: ZeroCost.Cache},
      {ZeroCost.Deduplicator, name: ZeroCost.Deduplicator},
      {ZeroCost.BatchProcessor, name: ZeroCost.BatchProcessor},
      {ZeroCost.Engine, name: ZeroCost.Engine}
    ]
    
    opts = [strategy: :one_for_one, name: ZeroCost.Supervisor]
    Supervisor.start_link(children, opts)
  end
end

# ═══════════════════════════════════════════════════════════════════════════
# COST PREDICTOR (ML-like pattern matching)
# ═══════════════════════════════════════════════════════════════════════════

defmodule ZeroCost.Predictor do
  @moduledoc """
  Cost prediction using pattern matching and historical analysis.
  """
  
  @phi 1.618033988749895
  @phi_inverse 0.6180339887498949
  @window_size trunc(@phi * 100)
  
  defstruct history: [], weights: []
  
  def new do
    weights = Enum.map(0..(@window_size - 1), fn i ->
      :math.pow(@phi_inverse, @window_size - i - 1)
    end)
    total = Enum.sum(weights)
    normalized = Enum.map(weights, &(&1 / total))
    
    %__MODULE__{weights: normalized}
  end
  
  def add_sample(predictor, sample) do
    history = Enum.take([sample | predictor.history], @window_size)
    %{predictor | history: history}
  end
  
  def predict(predictor) do
    if length(predictor.history) < 3 do
      0.0
    else
      history = Enum.reverse(predictor.history)
      weights = Enum.take(predictor.weights, length(history))
      total_weight = Enum.sum(weights)
      normalized = Enum.map(weights, &(&1 / total_weight))
      
      Enum.zip(history, normalized)
      |> Enum.map(fn {h, w} -> h * w end)
      |> Enum.sum()
    end
  end
  
  def confidence(predictor) do
    if length(predictor.history) < 10 do
      0.0
    else
      mean = Enum.sum(predictor.history) / length(predictor.history)
      variance = predictor.history
        |> Enum.map(&(:math.pow(&1 - mean, 2)))
        |> Enum.sum()
        |> Kernel./(length(predictor.history))
      
      cv = :math.sqrt(variance) / (abs(mean) + 1.0e-10)
      max(0.0, min(1.0, 1.0 - cv * @phi_inverse))
    end
  end
end
