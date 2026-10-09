import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useApp } from '../../context/AppContext';
import { populationService } from '../../services/populationService';
import { 
  Download, FileText, Target, TrendingUp, Users, 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Info
} from 'lucide-react';

export const PopulationForecastingModule = ({ locationId = null }) => {
  const { currentLocation } = useApp();
  const activeLocId = locationId || currentLocation?.id || 'kolhapur';

  // Compute full demographic forecasting data
  const data = useMemo(() => {
    return populationService.getDetailedPopulationForecast(activeLocId);
  }, [activeLocId]);

  // 1. Forecast Line Chart (2015 – 2030) with 4 Series
  const forecastChartOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#06b6d4',
        borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 12, fontFamily: 'monospace' },
        formatter: (params) => {
          let html = `<div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid #334155;padding-bottom:2px;color:#38bdf8;">Year: ${params[0].axisValue}</div>`;
          params.forEach((item) => {
            if (item.value !== null && item.value !== undefined) {
              html += `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:3px;">
                <span style="color:${item.color};display:inline-flex;align-items:center;gap:4px;">● ${item.seriesName}:</span>
                <span style="font-weight:bold;color:#fff;">${item.value} ${data.unit}</span>
              </div>`;
            }
          });
          return html;
        }
      },
      legend: {
        data: ['Training', 'Testing (held-out)', 'Moving Average (3-Yr)', 'Forecast (ARIMA)'],
        textStyle: { color: '#cbd5e1', fontSize: 11, fontWeight: 600 },
        top: 6
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '6%',
        top: '16%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.chartData.allYears,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: `{value} ${data.unit}`,
          color: '#94a3b8',
          fontSize: 11,
          fontFamily: 'monospace'
        },
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
      },
      series: [
        {
          name: 'Training',
          type: 'line',
          data: data.chartData.trainingSeries,
          lineStyle: { color: '#10b981', width: 2.8 },
          itemStyle: { color: '#10b981' },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: 'Testing (held-out)',
          type: 'line',
          data: data.chartData.testingSeries,
          lineStyle: { color: '#f59e0b', width: 2.2, type: 'dotted' },
          itemStyle: { color: '#f59e0b' },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: 'Moving Average (3-Yr)',
          type: 'line',
          data: data.chartData.movingAvgSeries,
          lineStyle: { color: '#eab308', width: 2.5 },
          itemStyle: { color: '#eab308' },
          symbol: 'none'
        },
        {
          name: 'Forecast (ARIMA)',
          type: 'line',
          data: data.chartData.forecastSeries,
          lineStyle: { color: '#06b6d4', width: 3, type: 'dashed' },
          itemStyle: { color: '#06b6d4' },
          symbol: 'diamond',
          symbolSize: 7
        }
      ]
    };
  }, [data]);

  // 2. Validation Chart: Actual vs Predicted Dual-Axis
  const validationChartOption = useMemo(() => {
    const testYears = data.validation.map((v) => v.testYear.toString());
    const actualVals = data.validation.map((v) => parseFloat((v.rawActual / data.divisor).toFixed(2)));
    const predVals = data.validation.map((v) => parseFloat((v.rawPredicted / data.divisor).toFixed(2)));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#f97316',
        borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 12, fontFamily: 'monospace' }
      },
      legend: {
        data: ['Actual', 'Predicted', 'Absolute Error'],
        textStyle: { color: '#cbd5e1', fontSize: 11, fontWeight: 600 },
        top: 6
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '6%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: testYears,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }
      },
      yAxis: [
        {
          type: 'value',
          name: `Population (${data.unit})`,
          nameTextStyle: { color: '#94a3b8', fontSize: 10 },
          scale: true,
          axisLabel: { formatter: `{value} ${data.unit}`, color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
          splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
        },
        {
          type: 'value',
          name: 'Abs Error (Persons)',
          nameTextStyle: { color: '#f97316', fontSize: 10 },
          scale: true,
          axisLabel: { color: '#f97316', fontSize: 10, fontFamily: 'monospace' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Actual',
          type: 'line',
          data: actualVals,
          lineStyle: { color: '#10b981', width: 2.8 },
          itemStyle: { color: '#10b981' },
          symbol: 'circle',
          symbolSize: 7
        },
        {
          name: 'Predicted',
          type: 'line',
          data: predVals,
          lineStyle: { color: '#06b6d4', width: 2.8, type: 'dashed' },
          itemStyle: { color: '#06b6d4' },
          symbol: 'diamond',
          symbolSize: 8
        },
        {
          name: 'Absolute Error',
          type: 'bar',
          yAxisIndex: 1,
          data: data.validation.map((v) => v.rawAbsError),
          itemStyle: { 
            color: '#f97316',
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: 26
        }
      ]
    };
  }, [data]);

  // CSV Export Action
  const handleExportCSV = () => {
    const headers = ['Year', 'Population (Raw)', `Population (${data.unit})`, `3-Yr Moving Avg (${data.unit})`, 'Type'];
    const rows = data.historical.map((h) => [
      h.year,
      h.population,
      h.popFormatted,
      h.movingAvgFormatted || '',
      h.type
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `demographic_forecast_${activeLocId}_2015_2029.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6 w-full text-slate-100 animate-in fade-in duration-300">
      
      {/* 1. SECTION 1: Historical Population & 3-Year Moving Average Table */}
      <div className="bg-[#091124] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Historical Population &amp; 3-Year Moving Average
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Location: {currentLocation?.name || 'Kolhapur'} (2015 – 2024 Baseline)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#060b16] text-cyan-300 border border-cyan-500/30">
              Units: {data.unit === 'L' ? 'Lakhs (100,000)' : 'Crores (10,000,000)'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#060b16] border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-bold">YEAR</th>
                <th className="py-3 px-4 font-bold">POPULATION</th>
                <th className="py-3 px-4 font-bold text-amber-400">3-YR MOVING AVG</th>
                <th className="py-3 px-4 font-bold text-right">TYPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#070e1c]">
              {data.historical.map((row) => (
                <tr key={row.year} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-white">{row.year}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-200">{row.popWithUnit}</td>
                  <td className="py-2.5 px-4 font-bold text-amber-400">
                    {row.movingAvgWithUnit}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        row.type === 'Official'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. SECTION 2: Interactive Forecast Line Chart (2015 – 2029) */}
      <div className="bg-[#091124] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Demographic Horizon Projections (2015 – 2029)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Historical baseline (Training &amp; Testing) alongside 3-Year Moving Average and ARIMA Forward Projections.
          </p>
        </div>

        <div className="w-full pt-2">
          <ReactECharts 
            option={forecastChartOption} 
            style={{ height: '380px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      </div>

      {/* 3. SECTION 3: ARIMA Hero Stat Card */}
      <div className="bg-gradient-to-br from-[#0a1428] via-[#091124] to-[#041a2e] rounded-3xl p-8 border border-cyan-500/40 text-center shadow-2xl space-y-3 text-white">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ARIMA — PREDICTED POPULATION {data.heroCard.targetYear}</span>
        </div>

        <div className="text-5xl sm:text-6xl font-extrabold font-mono text-cyan-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.45)]">
          {data.heroCard.predictedWithUnit}
        </div>

        <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
          Based on chronological expanding-window validated ARIMA(1, 1, 0) demographic growth model.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            MODEL ACCURACY: {data.heroCard.accuracy}
          </span>
          <span className="px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            3-YR MOVING AVG: {data.heroCard.movingAvgWithUnit}
          </span>
        </div>
      </div>

      {/* 4. SECTION 4: Chronological Expanding-Window Validation Table */}
      <div className="bg-[#091124] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chronological Expanding-Window Validation</span>
          </h3>
          <p className="text-xs text-slate-400">
            Strict out-of-sample evaluation: model trains strictly on preceding years and evaluates on the next held-out year.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#060b16] border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5">TRAINING PERIOD</th>
                <th className="py-3 px-3.5">TEST YEAR</th>
                <th className="py-3 px-3.5">ACTUAL</th>
                <th className="py-3 px-3.5">PREDICTED</th>
                <th className="py-3 px-3.5 text-orange-400">ABS ERROR</th>
                <th className="py-3 px-3.5">MAE</th>
                <th className="py-3 px-3.5">RMSE</th>
                <th className="py-3 px-3.5 text-cyan-400">MAPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#070e1c]">
              {data.validation.map((row) => (
                <tr key={row.testYear} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="py-2.5 px-3.5 text-slate-400">{row.trainingPeriod}</td>
                  <td className="py-2.5 px-3.5 font-bold text-white">{row.testYear}</td>
                  <td className="py-2.5 px-3.5 font-semibold text-emerald-400">{row.actual}</td>
                  <td className="py-2.5 px-3.5 font-semibold text-cyan-400">{row.predicted}</td>
                  <td className="py-2.5 px-3.5 font-bold text-orange-400">{row.absError}</td>
                  <td className="py-2.5 px-3.5 text-slate-400">{row.mae}</td>
                  <td className="py-2.5 px-3.5 text-slate-400">{row.rmse}</td>
                  <td className="py-2.5 px-3.5 font-bold text-cyan-300">{row.mape}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#060b16] border-t-2 border-slate-700 font-bold">
              <tr>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase text-[10px]">
                    OVERALL
                  </span>
                </td>
                <td className="py-3 px-3.5 text-slate-400">{data.overall.testCount} tests</td>
                <td className="py-3 px-3.5 text-slate-500">—</td>
                <td className="py-3 px-3.5 text-slate-500">—</td>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px]">
                    {data.overall.accuracy} Acc
                  </span>
                </td>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px]">
                    {data.overall.mae}
                  </span>
                </td>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px]">
                    {data.overall.rmse}
                  </span>
                </td>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px]">
                    {data.overall.mape}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-[11px] text-slate-400 italic flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Chronological expanding-window validation: each model trains only on earlier years and forecasts 1 held-out year. No lookahead bias.</span>
        </p>
      </div>

      {/* 5. SECTION 5: Actual vs Predicted across Test Years Dual-Axis Chart */}
      <div className="bg-[#091124] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
        <div>
          <h3 className="text-base font-bold text-white">
            Actual vs Predicted across Test Years
          </h3>
          <p className="text-xs text-slate-400">
            Evaluating historical fit against held-out years with absolute error magnitude columns.
          </p>
        </div>

        <div className="w-full pt-2">
          <ReactECharts 
            option={validationChartOption} 
            style={{ height: '340px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      </div>

      {/* 6. SECTION 6: Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handlePrintDossier}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Download Intelligence Dossier (PDF)</span>
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-6 py-3 rounded-2xl bg-[#081020] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Export CSV Data</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Model: ARIMA(1, 1, 0) • Verified without lookahead bias
        </div>
      </div>

    </div>
  );
};

export default PopulationForecastingModule;
