<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use PDF;
use App\Funcionario;

class PDFController extends Controller
{
    function index()
    {
        $funcionarios = $this->relatorioTodos();
        $total = 0;
        foreach ($funcionarios as $funcionario) {
            $total += $funcionario->fun_salario;
        };
        return view('relatorio_pdf')
            ->with('funcionarios_dados', $funcionarios)
            ->with('total', $total);
    }

    public function relatorioDois($set_id,$car_id) 
    {
        $funcionarios = DB::table('wtg_funcionario')
                ->where([
                    ['cargo_id', '=', $car_id],
                    ['setor_id', '=', $set_id],
                ])
                ->get();
        return $this->pdf($funcionarios);

    }

    public function relatorioSetor($set_id) 
    {
        $funcionarios = DB::table('wtg_funcionario')
                ->where('setor_id', '=', $set_id)
                ->get();
        return $this->pdf($funcionarios);

    }

    public function relatorioCargo($car_id) 
    {
        $funcionarios = DB::table('wtg_funcionario')
                ->where('cargo_id', '=', $car_id)
                ->get();
        return $this->pdf($funcionarios);

    }

    public function relatorioTodos() 
    {
    
        $funcionarios = Funcionario::all();
        return $this->pdf($funcionarios);

    }

    function pdf($funcionarios)
    {
        $pdf = \App::make('dompdf.wrapper');
        $pdf->loadHTML($this->
            converte_funcionario_dados_para_html($funcionarios)
        );
        return $pdf->stream();
    }

    function converte_funcionario_dados_para_html($funcionarios)
    {
        $funcionario_dados = $funcionarios;
        $total = $this->calculaTotal($funcionario_dados);
        $output = '
            <h1 align="center">Relatório</h1>
            <table width="100%" style="border-collapse:
                collapse; border: 0px;">
            <tr>
                <th style="border: 1px solid; padding: 12px;" width="20%">
                    Nome
                </th>
                <th style="border: 1px solid; padding: 12px;" width="20%">
                    Data de contratação
                </th>
                <th style="border: 1px solid; padding: 12px;" width="20%">
                    Salário
                </th>
            </tr>
        ';
        foreach($funcionario_dados as $funcionario)
        {
            $output .= '
            <tr>
                <td style = "border: 1px solid;
                padding:12px;">'.$funcionario->fun_nome.'</td>
                <td style = "border: 1px solid;
                padding:12px;">'.date('d/m/Y', strtotime($funcionario->fun_data_contratacao)).'</td>
                <td style = "border: 1px solid;
                padding:12px;">'.$funcionario->fun_salario.'</td>
            </tr>
            ';
        }
        $output.= '</table> <h3 align="right">Total: R$'.$total.'</h3>';
        return $output;
    }

    function calculaTotal($funcionarios)
    {
        $total = 0;
        foreach ($funcionarios as $funcionario) {
            $total += $funcionario->fun_salario;
        };
        return $total;
    }
}
