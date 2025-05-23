using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace byteclassAPI.Migrations
{
    /// <inheritdoc />
    public partial class Relationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alunos_Materias_MateriaId",
                table: "Alunos");

            migrationBuilder.DropIndex(
                name: "IX_Alunos_MateriaId",
                table: "Alunos");

            migrationBuilder.DropColumn(
                name: "MateriaId",
                table: "Alunos");

            migrationBuilder.CreateTable(
                name: "AlunosMaterias",
                columns: table => new
                {
                    AlunosUserId = table.Column<int>(type: "int", nullable: false),
                    MateriasId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlunosMaterias", x => new { x.AlunosUserId, x.MateriasId });
                    table.ForeignKey(
                        name: "FK_AlunosMaterias_Alunos_AlunosUserId",
                        column: x => x.AlunosUserId,
                        principalTable: "Alunos",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlunosMaterias_Materias_MateriasId",
                        column: x => x.MateriasId,
                        principalTable: "Materias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AlunosMaterias_MateriasId",
                table: "AlunosMaterias",
                column: "MateriasId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlunosMaterias");

            migrationBuilder.AddColumn<int>(
                name: "MateriaId",
                table: "Alunos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Alunos_MateriaId",
                table: "Alunos",
                column: "MateriaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alunos_Materias_MateriaId",
                table: "Alunos",
                column: "MateriaId",
                principalTable: "Materias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
