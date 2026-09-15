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
        backgroundColor: 'rgba(28, 25, 23, 0.95)',
        borderColor: '#0284c7',
        borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 12, fontFamily: 'monospace' },
        formatter: (params) => {
          let html = `<div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid #444;padding-bottom:2px;">Year: ${params[0].axisValue}</div>`;
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
        textStyle: { color: '#57534e', fontSize: 11, fontWeight: 600 },
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
        axisLine: { lineStyle: { color: '#d6d3d1' } },
        axisLabel: { color: '#78716c', fontSize: 11, fontFamily: 'monospace' }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: `{value} ${data.unit}`,
          color: '#78716c',
          fontSize: 11,
          fontFamily: 'monospace'
        },
        splitLine: { lineStyle: { color: '#f5f5f4', type: 'dashed' } }
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
          lineStyle: { color: '#0284c7', width: 3, type: 'dashed' },
          itemStyle: { color: '#0284c7' },
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
    const errVals = data.validation.map((v) => v.rawAbsError);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(28, 25, 23, 0.95)',
        borderColor: '#ea580c',
        borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 12, fontFamily: 'monospace' }
      },
      legend: {
        data: ['Actual', 'Predicted', 'Absolute Error'],
        textStyle: { color: '#57534e', fontSize: 11, fontWeight: 600 },
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
        axisLine: { lineStyle: { color: '#d6d3d1' } },
        axisLabel: { color: '#78716c', fontSize: 11, fontFamily: 'monospace' }
      },
      yAxis: [
        {
          type: 'value',
          name: `Population (${data.unit})`,
          nameTextStyle: { color: '#78716c', fontSize: 10 },
          scale: true,
          axisLabel: { formatter: `{value} ${data.unit}`, color: '#78716c', fontSize: 10, fontFamily: 'monospace' },
          splitLine: { lineStyle: { color: '#f5f5f4', type: 'dashed' } }
        },
        {
          type: 'value',
          name: 'Abs Error (Persons)',
          nameTextStyle: { color: '#ea580c', fontSize: 10 },
          scale: true,
          axisLabel: { color: '#ea580c', fontSize: 10, fontFamily: 'monospace' },
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
          lineStyle: { color: '#0284c7', width: 2.8, type: 'dashed' },
          itemStyle: { color: '#0284c7' },
          symbol: 'diamond',
          symbolSize: 8
        },
        {
          name: 'Absolute Error',
          type: 'bar',
          yAxisIndex: 1,
          data: errVals,
          itemStyle: {
            color: 'rgba(234, 88, 12, 0.75)',
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: 28
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

  // Print / PDF Dossier Action
  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6 w-full text-stone-900 animate-in fade-in duration-300">
      
      {/* 1. SECTION 1: Historical Population & 3-Year Moving Average Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Historical Population &amp; 3-Year Moving Average
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Location: {currentLocation?.name || 'Kolhapur'} (2015 – 2024 Baseline)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              Units: {data.unit === 'L' ? 'Lakhs (100,000)' : 'Crores (10,000,000)'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200/80">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-50/90 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-bold">YEAR</th>
                <th className="py-3 px-4 font-bold">POPULATION</th>
                <th className="py-3 px-4 font-bold text-amber-700">3-YR MOVING AVG</th>
                <th className="py-3 px-4 font-bold text-right">TYPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {data.historical.map((row) => (
                <tr key={row.year} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-stone-900">{row.year}</td>
                  <td className="py-2.5 px-4 font-semibold text-stone-800">{row.popWithUnit}</td>
                  <td className="py-2.5 px-4 font-bold text-amber-600">
                    {row.movingAvgWithUnit}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        row.type === 'Official'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-sky-50 text-sky-800 border-sky-200'
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
      <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Forecast Chart (2015 – 2029)
            </h3>
            <p className="text-xs text-stone-500">
              Historical baseline (Training &amp; Testing) alongside 3-Year Moving Average and ARIMA Forward Projections.
            </p>
          </div>
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
      <div className="bg-gradient-to-br from-stone-900 via-[#0a192f] to-[#042036] rounded-3xl p-8 border border-sky-900/40 text-center shadow-xl space-y-3 text-white">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ARIMA — PREDICTED POPULATION {data.heroCard.targetYear}</span>
        </div>

        <div className="text-5xl sm:text-6xl font-extrabold font-mono text-cyan-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
          {data.heroCard.predictedWithUnit}
        </div>

        <p className="text-xs text-stone-300 font-sans max-w-md mx-auto">
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
      <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>Chronological Expanding-Window Validation</span>
          </h3>
          <p className="text-xs text-stone-500">
            Strict out-of-sample evaluation: model trains strictly on preceding years and evaluates on the next held-out year.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-50/90 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5">TRAINING PERIOD</th>
                <th className="py-3 px-3.5">TEST YEAR</th>
                <th className="py-3 px-3.5">ACTUAL</th>
                <th className="py-3 px-3.5">PREDICTED</th>
                <th className="py-3 px-3.5 text-orange-600">ABS ERROR</th>
                <th className="py-3 px-3.5">MAE</th>
                <th className="py-3 px-3.5">RMSE</th>
                <th className="py-3 px-3.5 text-cyan-700">MAPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {data.validation.map((row) => (
                <tr key={row.testYear} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-2.5 px-3.5 text-stone-600">{row.trainingPeriod}</td>
                  <td className="py-2.5 px-3.5 font-bold text-stone-900">{row.testYear}</td>
                  <td className="py-2.5 px-3.5 font-semibold text-emerald-700">{row.actual}</td>
                  <td className="py-2.5 px-3.5 font-semibold text-sky-700">{row.predicted}</td>
                  <td className="py-2.5 px-3.5 font-bold text-orange-600">{row.absError}</td>
                  <td className="py-2.5 px-3.5 text-stone-600">{row.mae}</td>
                  <td className="py-2.5 px-3.5 text-stone-600">{row.rmse}</td>
                  <td className="py-2.5 px-3.5 font-bold text-cyan-700">{row.mape}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100/90 border-t-2 border-stone-300 font-bold">
              <tr>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 uppercase text-[10px]">
                    OVERALL
                  </span>
                </td>
                <td className="py-3 px-3.5 text-stone-600">{data.overall.testCount} tests</td>
                <td className="py-3 px-3.5 text-stone-400">—</td>
                <td className="py-3 px-3.5 text-stone-400">—</td>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px]">
                    {data.overall.accuracy} Acc
                  </span>
                </td>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[11px]">
                    {data.overall.mae}
                  </span>
                </td>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[11px]">
                    {data.overall.rmse}
                  </span>
                </td>
                <td className="py-3 px-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 text-[11px]">
                    {data.overall.mape}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-[11px] text-stone-500 italic mt-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>Chronological expanding-window validation: each model trains only on earlier years and forecasts 1 held-out year. No random split.</span>
        </p>
      </div>

      {/* 5. SECTION 5: Actual vs Predicted across Test Years Dual-Axis Chart */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-xs">
        <div className="mb-2">
          <h3 className="text-base font-serif font-bold text-stone-900">
            Actual vs Predicted across Test Years
          </h3>
          <p className="text-xs text-stone-500">
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
            className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Intelligence Dossier (PDF)</span>
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <FileText className="w-4 h-4 text-primary" />
            <span>Export CSV Data</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 font-mono">
          Model: ARIMA(1, 1, 0) • Verified without lookahead bias
        </div>
      </div>

    </div>
  );
};

export default PopulationForecastingModule;
