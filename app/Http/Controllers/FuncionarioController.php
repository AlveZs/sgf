<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Funcionario;
use Validator;


class FuncionarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {      
        $validator = Validator::make($request->all(), [ 
            'nome' => 'required|max:255',
            'salario' => 'required|numeric|min:0',
            'cargo' => 'required',  
            'setor' => 'required', 
        ]);   
        if ($validator->fails()) 
        {          
            return response()->json(['error'=>$validator->errors()], 401);                        
        }
        $funcionario = new Funcionario([
            'fun_nome' => $request->get('nome'),
            'fun_salario' => $request->get('salario'),
            'fun_data_nascimento' => $request->get('data_nascimento'),
            'fun_data_contratacao' => $request->get('data_contratacao'),
            'cargo_id' => $request->get('cargo'),
            'setor_id' => $request->get('setor')
        ]);
        $funcionario->save();
    }

    public function showAll() 
    {
        $funcionarios = DB::table('wtg_funcionario')
            ->join('wtg_cargo', 'wtg_funcionario.cargo_id', '=', 'wtg_cargo.cargo_id')
            ->join('wtg_setor', 'wtg_funcionario.setor_id', '=', 'wtg_setor.setor_id')
            ->select('wtg_funcionario.*', 'wtg_cargo.car_nome', 'wtg_setor.set_nome')
            ->get();
        return $funcionarios;

        //return Funcionario::all();
    }

    public function relatorioDois($set_id,$car_id) 
    {
        $funcionarios = DB::table('wtg_funcionario')
                ->where([
                    ['cargo_id', '=', $car_id],
                    ['setor_id', '=', $set_id],
                ])
                ->get();
        return $funcionarios;

    }

    public function relatorioSetor($set_id) 
    {
        $funcionarios = DB::table('wtg_funcionario')
                ->where('setor_id', '=', $set_id)
                ->get();
        return $funcionarios;

    }

    public function relatorioCargo($car_id) 
    {
        $funcionarios = DB::table('wtg_funcionario')
                ->where('cargo_id', '=', $car_id)
                ->get();
        return $funcionarios;

    }

    public function relatorioTodos() 
    {
    
        return Funcionario::all();

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $funcionario = Funcionario::find($id);
        $funcionario->fun_nome = $request->get('nome');
        $funcionario->fun_salario = $request->get('salario');
        $funcionario->fun_data_nascimento = $request->get('data_nascimento');
        $funcionario->fun_data_contratacao = $request->get('data_contratacao');
        $funcionario->cargo_id = $request->get('cargo');
        $funcionario->setor_id = $request->get('setor');
        $funcionario->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $funcionario = Funcionario::find($id);
        $funcionario->delete();
    }
}
