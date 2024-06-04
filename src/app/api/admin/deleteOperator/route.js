import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function DELETE(req){
try {
    const {operator_id}  = await req.json();
    console.log(operator_id);
    const {affectedRows} = await conn.query('DELETE FROM operators WHERE id = ?', [operator_id]);
    return NextResponse.json({affectedRows}, 200);
} catch (error) {
    return NextResponse.error({message: error.message});
}
}